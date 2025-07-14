type CheckboxProps = {
  checked: boolean;
  onChange: () => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  className?: string;
};

const Checkbox = ({
  checked,
  onChange,
  onClick,
  className = "",
}: CheckboxProps) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      onClick={onClick}
      className={`w-4 h-4 cursor-pointer accent-blue-600 ${className}`}
    />
  );
};

export default Checkbox;
