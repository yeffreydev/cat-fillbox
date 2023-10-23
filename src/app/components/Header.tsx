import Link from "next/link";

interface Props {
  categories: string[];
}
function Header({ categories }: Props) {
  return (
    <nav className="flex justify-between w-11/12 mx-auto h-[70px] items-center">
      <Link href={"/"}>
        <h1 className=" text-xl font-semibold">FillBox</h1>
      </Link>
      <ul className="flex-1 flex gap-3 justify-end">
        {categories.map((item, index) => {
          return (
            <li key={index}>
              <a href={"/products/" + item}>{item[0].toUpperCase() + item.slice(1)}</a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default Header;
