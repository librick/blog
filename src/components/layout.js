import * as React from "react"
import { Link } from "gatsby"
import ThemeToggle from "../components/themeToggle"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  if (isRootPath) {
    header = (
      <h1 className="main-heading">
        <Link to="/">{title}</Link>
      </h1>
    )
  } else {
    header = (
      <div className='header-and-theme-toggle'>
        <Link className="header-link-home" to="/">
          {title}
        </Link>
        <ThemeToggle />
      </div>
    )
  }

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">{header}</header>
      <main>{children}</main>
      <footer>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto' }}>
          {/* <a href='https://github.com/librick'>github</a> */}
          <span>© {new Date().getFullYear()},{` `}Perceptron</span>
        </div>
      </footer>
    </div>
  )
}

export default Layout
