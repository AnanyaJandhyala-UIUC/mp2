import { NavLink } from 'react-router-dom'
import styles from './Navbar.module.css'

function linkClass(isActive: boolean): string {
  return isActive ? `${styles.link} ${styles.active}` : styles.link
}

export default function Navbar() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Primary">
        <NavLink to="/" className={styles.brand} end>
          ART EXPLORER
        </NavLink>
        <div className={styles.links}>
          <NavLink to="/" className={({ isActive }) => linkClass(isActive)} end>
            List
          </NavLink>
          <NavLink to="/gallery" className={({ isActive }) => linkClass(isActive)}>
            Gallery
          </NavLink>
        </div>
      </nav>
    </header>
  )
}
