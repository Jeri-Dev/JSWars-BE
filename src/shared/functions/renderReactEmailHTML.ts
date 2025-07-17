import React from 'react'
import { render } from '@react-email/render'

export const renderReactEmailHTML = async (Element: React.JSX.Element) => {
  return await render(Element)
}
