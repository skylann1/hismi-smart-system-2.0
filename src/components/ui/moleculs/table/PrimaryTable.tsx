import React from "react";

export interface TableHeader {
  key: string;
  label: string;
}

export type TableRow = {
  id: string | number;
  [key: string]: unknown;
};

interface PrimaryTableProps {
  title: string;
  description: string;
  headers: TableHeader[];
  data: TableRow[];
  renderActions?: (row: TableRow) => React.ReactNode;
  onAddClick?: () => void; // opsional button tambah
}

const PrimaryTable: React.FC<PrimaryTableProps> = ({
  title,
  description,
  headers,
  data,
  renderActions,
  onAddClick,
}) => {
  return (
    <div className="shadow-md rounded-md sm:rounded-lg overflow-hidden h-screen bg-white">
      {/* Bagian Judul, Deskripsi, & Tombol Tambah */}
      <div className="p-5 text-lg text-left text-gray-900 font-bold flex justify-between items-end gap-4 bg-white">
        <div>
          {title}
          <p className="font-normal mt-1 text-xs sm:text-sm text-gray-500">
            {description}
          </p>
        </div>
        {onAddClick && (
          <button
            onClick={onAddClick}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 cursor-pointer"
          >
            + Tambah
          </button>
        )}
      </div>

      {/* Bagian Tabel */}
      <div className="relative overflow-x-auto mt-4 bg-white">
        <table className="w-full text-sm text-left text-gray-500">
          {/* Header Tabel */}
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              {headers.map((header) => (
                <th scope="col" key={header.key} className="px-6 py-3">
                  {header.label}
                </th>
              ))}
              {renderActions && (
                <th scope="col" className="px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>
          {/* Isi Tabel */}
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className="bg-white border-b border-gray-200"
              >
                {headers.map((header, colIndex) => {
                  const cellData = row[header.key];
                  // Kolom pertama jadi <th>
                  if (colIndex === 0) {
                    return (
                      <th
                        scope="row"
                        key={header.key}
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        {cellData as React.ReactNode}
                      </th>
                    );
                  }
                  return (
                    <td key={header.key} className="px-6 py-4">
                      {cellData as React.ReactNode}
                    </td>
                  );
                })}
                {/* Kolom Aksi */}
                {renderActions && (
                  <td className="px-6 py-4 text-right">
                    {renderActions(row)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrimaryTable;