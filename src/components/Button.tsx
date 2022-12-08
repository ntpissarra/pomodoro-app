import React from 'react';

interface Props {
  onClick?: () => void;
  text: string;
  className?: string;
}

const Button = (props: Props) => {
  return (
    <button onClick={props.onClick} className={props.className}>
      {props.text}
    </button>
  );
};

export default Button;
