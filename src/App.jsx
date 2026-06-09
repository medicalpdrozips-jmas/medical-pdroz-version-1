import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { appRoutes, getPageMeta } from './app/routes.jsx'
import { AppLoader } from './components/AppLoader'
import { Shell } from './components/Shell'

function RoutedPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const currentPage = getPageMeta(location.pathname)
  const isLoginRoute = location.pathname === '/login'

  const content = (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        {appRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </>
  )

  if (isLoginRoute) {
    return content
  }

  return (
    <Shell currentPath={location.pathname} currentPage={currentPage} onNavigate={navigate}>
      {content}
    </Shell>
  )
}

export default function App() {
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowLoader(false)
    }, 900)

    return () => window.clearTimeout(timer)
  }, [])

  if (showLoader) {
    return <AppLoader />
  }

  return <RoutedPage />
}
