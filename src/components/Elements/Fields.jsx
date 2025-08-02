import Input from "./Input";
import Label from "./Label";

export default function Fields({
  children,
  type,
  placeholder,
  value,
  onChange,
  className
}) {
  return (
    <div className={`${className} flex flex-col mt-3`}>
      <Label children={children} />
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
