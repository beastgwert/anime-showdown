import { useState, useLayoutEffect } from "react";
import { RippleContainer } from "./Ripple.styled";

function RippleCleanUp(rippleCount, duration, cleanUpFunction){
  useLayoutEffect(() => {
    let bounce = null;
    if (rippleCount > 0) {
      clearTimeout(bounce);

      bounce = setTimeout(() => {
        cleanUpFunction();
        clearTimeout(bounce);
      }, duration * 4);
    }

    return () => clearTimeout(bounce);
  }, [rippleCount, duration, cleanUpFunction]);
}

export default function Ripple({duration, color}){
  const [rippleArray, setRippleArray] = useState([]);

  RippleCleanUp(rippleArray.length, duration, () => {
    setRippleArray([]);
  });

  const addRipple = (e) => {
    const rippleContainer = e.currentTarget.getBoundingClientRect();
    const size =
      rippleContainer.width > rippleContainer.height
        ? rippleContainer.width
        : rippleContainer.height;
    const x = e.pageX - rippleContainer.x - size / 2;
    const y = e.pageY - rippleContainer.y - size / 2;
    const newRipple = {x, y, size};

    setRippleArray([...rippleArray, newRipple]);
  };

  return (
    <RippleContainer duration={duration} color={color} onMouseDown={addRipple}>
      {rippleArray.length > 0 &&
        rippleArray.map((ripple, index) => {
          return (
            <span
              key={"span" + index}
              style={{
                top: ripple.y,
                left: ripple.x,
                width: ripple.size,
                height: ripple.size,
              }}
            />
          );
        })}
    </RippleContainer>
  );
};

Ripple.defaultProps = {
  duration: 850,
  color: "#fff",
};


