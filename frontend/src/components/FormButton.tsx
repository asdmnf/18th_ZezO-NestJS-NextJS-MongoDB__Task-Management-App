import { LoaderPinwheel } from "lucide-react";

const FormButton = ({
  BtnName,
  pending,
  onClick,
}: {
  BtnName: string;
  pending?: boolean;
  onClick: (e: React.FormEvent) => Promise<void>;
}) => {
  return (
    <button
      disabled={pending}
      className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded border-0 cursor-pointer disabled:cursor-wait flex items-center justify-center"
      type="submit"
      onClick={onClick}
    >
      {pending ? <LoaderPinwheel className="animate-spin" /> : BtnName}
    </button>
  );
};

export default FormButton;
