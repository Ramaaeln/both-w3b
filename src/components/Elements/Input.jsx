export default function Input({
  type = "text",
  placeholder,
  value,
  onChange = () => {},
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className=" border-b-1 border-black focus:outline-hidden focus:border-b-blue-500  p-1 w-full"
    />
  );
}
