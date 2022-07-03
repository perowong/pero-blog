import * as React from "react"
import { Link } from "gatsby"
import { Helmet } from "react-helmet"

import Toggle from './Toggle';
import sun from '../images/sun.png';
import moon from '../images/moon.png';

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  const [theme, setTheme] = React.useState(null)

  React.useEffect(() => {
    setTheme(window.__theme)
    window.__onThemeChange = () => {
      setTheme(window.__theme)
    }
  }, [])

  if (isRootPath) {
    header = (
      <h1 className="main-heading">
        <Link to="/">{title}</Link>
      </h1>
    )
  } else {
    header = (
      <Link className="header-link-home" to="/">
        {title}
      </Link>
    )
  }

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      {theme && <Helmet
        meta={[
          {
            name: `theme-color`,
            content: theme === "light" ? "#ffffff" : "#282c35",
          },
        ]}
      />}
      <header
        className="global-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {header}
        {theme !== null ? (
          <Toggle
            icons={{
              checked: (
                <img
                  src={moon}
                  width="16"
                  height="16"
                  role="presentation"
                  style={{ pointerEvents: 'none' }}
                  alt=""
                />
              ),
              unchecked: (
                <img
                  src={sun}
                  width="16"
                  height="16"
                  role="presentation"
                  style={{ pointerEvents: 'none' }}
                  alt=""
                />
              ),
            }}
            checked={theme === 'dark'}
            onChange={e =>
              window.__setPreferredTheme(
                e.target.checked ? 'dark' : 'light'
              )
            }
          />
        ) : (
          <div style={{ height: '24px' }} />
        )}
      </header>
      <main>{children}</main>
    </div>
  )
}

export default Layout
