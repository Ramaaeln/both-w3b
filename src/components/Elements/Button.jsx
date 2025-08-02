export default function Button({
  type = "button",
  children,
  className,
  onClick = () => {},
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${className} cursor-pointer rounded-sm p-1 font-bold`}
    >
      {children}
    </button>
  );
}
