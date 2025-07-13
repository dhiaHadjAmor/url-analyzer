import type { BrokenLink } from "../../../lib/types";

type BrokenLinksTableProps = {
  links: BrokenLink[];
};

const BrokenLinksTable = ({ links }: BrokenLinksTableProps) => {
  if (!links.length) {
    return (
      <div className="text-sm text-gray-500" role="note">
        No broken links detected.
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <table className="min-w-full text-sm text-left text-gray-700 border rounded-md">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-4 py-2 border-b">Link</th>
            <th className="px-4 py-2 border-b">Status Code</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link) => (
            <tr key={link.id} className="border-t">
              <td className="px-4 py-2 truncate max-w-[300px]">
                <a
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                  title={link.link}
                >
                  {link.link}
                </a>
              </td>
              <td className="px-4 py-2">{link.statusCode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BrokenLinksTable;
