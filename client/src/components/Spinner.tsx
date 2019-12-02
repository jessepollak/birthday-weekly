import React from 'react'
import { Spinner as BootstrapSpinner } from 'react-bootstrap'

export const Spinner: React.FC = () => {
  return (
    <div className="d-flex justify-content-center">
      <BootstrapSpinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </BootstrapSpinner>
    </div>
  )
}


export default Spinner