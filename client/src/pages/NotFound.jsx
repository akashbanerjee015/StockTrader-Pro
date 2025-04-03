import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/">
          <button className="btn btn-primary">Go to Home</button>
        </Link>
      </div>
    </div>
  )
}

export default NotFound