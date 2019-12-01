import React from 'react'
import { Spinner as BootstrapSpinner } from 'react-bootstrap'

export const Spinner: React.FC = () => {
  return (
    <BootstrapSpinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </BootstrapSpinner>
  )
}

export default Spinner