import { Injectable } from "@nestjs/common"

type CleanInput<T> = Partial<Omit<T, "id" | "createdAt" | "updatedAt">>
type WhereCondition<T> = Partial<T>
type SelectFields<T> = Partial<Record<keyof T, boolean>>

interface PrismaDelegate<T> {
	create: (args: { data: any }) => Promise<T>

	findFirst: (args?: {
		where?: any
		orderBy?: any
		select?: any
		include?: any
	}) => Promise<T | null>
	findUnique: (args: {
		where: any
		select?: any
		include?: any
	}) => Promise<T | null>

	count: (args?: { where?: any }) => Promise<number>
	update: (args: { where: any; data: any }) => Promise<T>
	delete: (args: { where: any }) => Promise<T>
	deleteMany: (args: { where: any }) => Promise<{ count: number }>
	upsert: (args: { where: any; update: any; create: any }) => Promise<T>
}

type ExtractFindManyArgs<TDelegate> = TDelegate extends {
	findMany: (args?: infer Args) => any
}
	? Args
	: never

type ExtractWhereType<TDelegate> = ExtractFindManyArgs<TDelegate> extends {
	where?: infer Where
}
	? Where
	: Record<string, any>

type ExtractIncludeType<TDelegate> = ExtractFindManyArgs<TDelegate> extends {
	include?: infer Include
}
	? Include
	: Record<string, any>

type ExtractOrderByType<TDelegate> = ExtractFindManyArgs<TDelegate> extends {
	orderBy?: infer OrderBy
}
	? OrderBy
	: Record<string, "asc" | "desc">

type ExtractSelectType<TDelegate> = ExtractFindManyArgs<TDelegate> extends {
	select?: infer Select
}
	? Select
	: Record<string, boolean>

type PrismaQueryExtension<T, TDelegate> = {
	include?: ExtractIncludeType<TDelegate>
	orderBy?: ExtractOrderByType<TDelegate>
	select?: ExtractSelectType<TDelegate>
	distinct?: keyof T | (keyof T)[]
	cursor?: Partial<T>
	take?: number
	omit?: Partial<Record<keyof T, boolean>>
}

export interface PrismaPaginationOptions<T, TDelegate> {
	where?: ExtractWhereType<TDelegate>
	max?: number
	page?: number
	sort?: boolean
	orderSort?: "asc" | "desc"
	sortField?: keyof T
	select?: SelectFields<T>
	startDate?: string
	endDate?: string
	searchBetweenDates?: boolean
	queryExtension?: PrismaQueryExtension<T, TDelegate>
	// Nuevo: parámetros where externos que se pueden agregar dinámicamente
	externalWhere?: ExtractWhereType<TDelegate>
}

export interface PaginationResult<TData> {
	metadata: {
		total: number
		page: number
		max: number
		next: boolean
		previous: boolean
		totalPages: number
	}
	data: TData[]
}

@Injectable()
export class StandardRepository<
	T extends Record<string, any>,
	TDelegate extends PrismaDelegate<T> = PrismaDelegate<T>,
> {
	constructor(protected readonly model: TDelegate) {}

	async create(data: CleanInput<T>): Promise<T> {
		return this.model.create({ data })
	}

	async findOne(where: WhereCondition<T>): Promise<T | null> {
		return this.model.findFirst({ where })
	}

	async getAll(select?: SelectFields<T>): Promise<T[]> {
		const model = this.model as any
		return model.findMany(select ? { select } : {})
	}

	async findLatestQuery(where: WhereCondition<T>): Promise<T | null> {
		return this.model.findFirst({
			where,
			orderBy: { createdAt: "desc" },
		})
	}

	async findByIds(ids: string[], select?: SelectFields<T>): Promise<T[]> {
		const model = this.model as any
		return model.findMany({
			where: { id: { in: ids } } as any,
			...(select ? { select } : {}),
		})
	}

	async findLast(): Promise<T | null> {
		return this.model.findFirst({ orderBy: { createdAt: "desc" } })
	}

	async findById(id: string): Promise<T | null> {
		return this.model.findUnique({ where: { id } })
	}

	async findAll(): Promise<T[]> {
		const model = this.model as any
		return model.findMany()
	}

	async findQuery(where: WhereCondition<T>): Promise<T[]> {
		const model = this.model as any
		return model.findMany({ where })
	}

	async getCount(where?: WhereCondition<T>): Promise<number> {
		return this.model.count({ where })
	}

	async findOrQuery(where: Partial<T>[]): Promise<T | null> {
		const model = this.model
		return model.findFirst({
			where: {
				OR: where,
			},
		})
	}

	async update(id: string, data: CleanInput<T>): Promise<T | null> {
		try {
			return await this.model.update({ where: { id }, data })
		} catch (error: any) {
			if (error.code === "P2025") return null
			throw error
		}
	}

	async delete(id: string): Promise<T | null> {
		try {
			return await this.model.delete({ where: { id } })
		} catch (error: any) {
			if (error.code === "P2025") return null
			throw error
		}
	}

	async deleteMany(ids: string[]): Promise<{ count: number }> {
		return this.model.deleteMany({ where: { id: { in: ids } } as any })
	}

	async deleteManyQuery(where: WhereCondition<T>): Promise<{ count: number }> {
		return this.model.deleteMany({ where })
	}

	async findOrCreate(
		where: WhereCondition<T>,
		data: CleanInput<T>,
	): Promise<T> {
		const existing = await this.model.findFirst({ where })
		if (existing) return existing
		return this.model.create({ data: { ...where, ...data } })
	}

	async updateOrCreate(
		where: WhereCondition<T>,
		data: CleanInput<T>,
	): Promise<T> {
		return this.model.upsert({
			where: where as any,
			update: data,
			create: { ...where, ...data },
		})
	}

	// Método público para paginación con soporte para where externo
	async paginateWithExternalWhere<TResult = T>(
		options: PrismaPaginationOptions<T, TDelegate> = {},
	): Promise<PaginationResult<TResult>> {
		return this.paginate<TResult>(options)
	}

	protected async paginate<TResult = T>(
		options: PrismaPaginationOptions<T, TDelegate> = {},
	): Promise<PaginationResult<TResult>> {
		const {
			where = {},
			max = 10,
			page = 1,
			sort = true,
			orderSort = "desc",
			sortField = "createdAt" as keyof T,
			select,
			startDate,
			endDate,
			searchBetweenDates = false,
			queryExtension = {},
			externalWhere = {}, // Nuevo: parámetros where externos
		} = options

		const skip = (page - 1) * max

		const dateFilter: any = {}
		if (startDate && endDate) {
			const startDateObj = new Date(startDate)
			const endDateObj = new Date(endDate)
			endDateObj.setHours(23, 59, 59, 999)

			if (searchBetweenDates) {
				dateFilter.createdAt = {
					gt: startDateObj,
					lt: endDateObj,
				}
			} else {
				dateFilter.createdAt = {
					gte: startDateObj,
					lte: endDateObj,
				}
			}
		} else if (startDate) {
			const startDateObj = new Date(startDate)
			dateFilter.createdAt = searchBetweenDates
				? { gt: startDateObj }
				: { gte: startDateObj }
		} else if (endDate) {
			const endDateObj = new Date(endDate)
			endDateObj.setHours(23, 59, 59, 999)
			dateFilter.createdAt = searchBetweenDates
				? { lt: endDateObj }
				: { lte: endDateObj }
		}

		// Combinar todos los where: base, filtros de fecha y externos
		const combinedWhere = {
			...(where as any),
			...dateFilter,
			...(externalWhere as any), // Los parámetros externos tienen precedencia
		}

		const orderBy = sort ? { [sortField]: orderSort } : undefined

		const { take: extensionTake, omit, ...restQueryExtension } = queryExtension

		const baseQuery = {
			where: combinedWhere,
			...(orderBy && { orderBy }),
			...(select && { select }),
			...(omit && { omit }),
			...restQueryExtension,
		}

		const finalTake = extensionTake !== undefined ? extensionTake : max
		const model = this.model as any

		const [total, data] = await Promise.all([
			model.count({ where: combinedWhere }),
			model.findMany({
				...baseQuery,
				skip,
				take: finalTake,
			}) as unknown as Promise<TResult[]>,
		])

		const metadata = {
			total,
			page,
			max: finalTake,
			next: total > skip + finalTake,
			previous: page > 1,
			totalPages: Math.ceil(total / finalTake),
		}

		return {
			metadata,
			data,
		}
	}
}
