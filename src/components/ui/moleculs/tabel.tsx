import { inter } from "@/app/fonts";
import Link from "next/link";

// Column type with generic T
export type Column<T> = {
  header: string;
  accessor: keyof T;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
};

const Table = <T,>({ columns, data }: TableProps<T>) => {
  const visibleColumns = columns.filter((col) => col.accessor !== "id");

  return (
    <div
      className={`rounded-md sm:rounded-lg overflow-hidden bg-white ${inter.className}`}
    >
      <div className="relative overflow-x-auto bg-white">
        <table className="w-full h-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              {visibleColumns.map((col, index) => (
                <th key={index} scope="col" className="px-6 py-3">
                  {col.header}
                </th>
              ))}
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="md:max-h-[50vh] overflow-y-auto">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="bg-white border-b border-gray-200">
                {visibleColumns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    {col.render
                      ? col.render(row[col.accessor], row)
                      : String(row[col.accessor])}
                  </td>
                ))}
                <td className="px-6 py-4 text-right">
                  <Link
                    href="#"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
