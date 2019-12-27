import React from 'react'
import { Spinner as BootstrapSpinner } from 'react-bootstrap'

export interface ISpinner {
  size?: "sm" | undefined
}

export const Spinner: React.FC<ISpinner> = ({ size }) => {
  return (
    <BootstrapSpinner animation="border" role="status" size={size}>
      <span className="sr-only">Loading...</span>
    </BootstrapSpinner>
  )
}

export default Spinner