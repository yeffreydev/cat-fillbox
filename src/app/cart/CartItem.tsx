import { AiOutlineDelete } from "react-icons/ai";
export default function CartItem() {
  return (
    <div className="flex flex-col md:flex-row w-full items-start gap-10 border-b border-gray-200 p-2">
      <div className="flex gap-2 flex-1">
        <div className="w-[100px] border border-black h-[100px]"></div>
        <div>
          <p>Product Name</p>
          <div>
            <span>Product Price</span> <span className="text-bold text-lg">S/. 500</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 p-1">
        <div className="flex items-center gap-7 px-2 rounded text-2xl border border-gray-300 md:border-black ">
          <button className="p-2"> - </button>
          <span>2</span>
          <button className="p-2"> + </button>
        </div>
        <div>
          <button className="text-red-500 text-xl">
            <AiOutlineDelete />
          </button>
        </div>
      </div>
      <div className="flex gap-2 md:gap-0 md:flex-col">
        <span>total Price</span>
        <span className="font-semibold">S/. 100</span>
      </div>
    </div>
  );
}
