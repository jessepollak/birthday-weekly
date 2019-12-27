
import React from 'react'
import { useSpring , animated } from 'react-spring'
import { Button as BootstrapButton, ButtonProps } from 'react-bootstrap'
import Spinner from './Spinner'

export interface IButton extends ButtonProps, React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean | undefined
}

export const Button: React.FC<IButton> = ({ isLoading, children, ...props }) => {
/* showLoader is used to stay in the "isLoading state" a bit longer to avoid loading flashes
   if the loading state is too short. */
  const [showLoader, setShowLoader] = React.useState(false)

  React.useEffect(() => {
    if (isLoading) {
      setShowLoader(true)
    }

    // Show loader a bits longer to avoid loading flash
    if (!isLoading && showLoader) {
      const timeout = setTimeout(() => {
        setShowLoader(false)
      }, 400)

      return () => {
        clearTimeout(timeout)
      }
    }
  }, [isLoading, showLoader])

  /* Capture the dimensions of the button before the loading happens
  so it doesn’t change size.
  These hooks can be put in a seprate file. */
  const [width, setWidth] = React.useState(0)
  const [height, setHeight] = React.useState(0)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (ref && ref.current && ref.current.getBoundingClientRect().width) {
      setWidth(ref.current.getBoundingClientRect().width)
    }
    if (ref && ref.current && ref.current.getBoundingClientRect().height) {
      setHeight(ref.current.getBoundingClientRect().height)
    }

  }, [children])

  // Hooks used to fade in/out the loader or the button contents
  const fadeOutProps = useSpring({ opacity: showLoader ? 1 : 0 })
  const fadeInProps = useSpring({ opacity: showLoader ? 0 : 1 })

  return (
    <div ref={ref}>
      <BootstrapButton 
        disabled={props.disabled || isLoading} 
        style={
          showLoader
            ? {
                width: `${width}px`,
                height: `${height}px`
              }
            : {}
        }
        {...props}
      >
        {showLoader ? (
          <animated.div style={fadeOutProps}>
            <div>
              <Spinner size="sm" />
            </div>
          </animated.div>
        ) : (
          <animated.div style={fadeInProps}>{children}</animated.div>
        )}
      </BootstrapButton>
    </div>
  )

}

export default Button