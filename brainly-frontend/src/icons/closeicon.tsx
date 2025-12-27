interface closeiconprops {
  onClose: () => void;
}
export function Closeicon(props: closeiconprops) {
  return (
    <div className="cursor-pointer hover:scale-110 transition-all ease-in-out hover:text-neutral-200">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="3"
        stroke="currentColor"
        className="size-5"
        onClick={props.onClose}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18 18 6M6 6l12 12"
        />
      </svg>
    </div>
  );
}
