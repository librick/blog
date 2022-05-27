import * as React from "react"
import { ThemeToggler } from 'gatsby-plugin-dark-mode'

import Toggle from "./toggle"
import sun from '../images/sun.png';
import moon from '../images/moon.png';

const ThemeToggle = () => {
    return (
        <ThemeToggler>
        {({ theme, toggleTheme }) => (
              <Toggle
                icons={{
                  checked: (
                    <img
                      src={moon}
                      width="16"
                      height="16"
                      role="presentation"
                      style={{ pointerEvents: 'none' }}
                    />
                  ),
                  unchecked: (
                    <img
                      src={sun}
                      width="16"
                      height="16"
                      role="presentation"
                      style={{ pointerEvents: 'none' }}
                    />
                  ),
                }}
                checked={theme === 'dark'}
                onChange={e => toggleTheme(e.target.checked ? 'dark' : 'light')}
              />
        )}
      </ThemeToggler>
    )
}

export default ThemeToggle
