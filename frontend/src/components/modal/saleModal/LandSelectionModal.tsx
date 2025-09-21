import { useState, useMemo } from "react";
import { LandTypes } from "../../../store/slices/landSlice";
import Checkbox from "../../form/input/Checkbox";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "../../ui/table";
import Filter from "../../filter/Filter";

interface ClientFormModalProp {
  isOpen: boolean;
  onClose: () => void;
  selectedData: (data: LandTypes) => void;
}

const LandSelectionModal = ({
  isOpen,
  onClose,
  selectedData,
}: ClientFormModalProp) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLand, setSelectedLand] = useState<LandTypes>();
  const [sortBy, setSortBy] = useState("");

  const mockLands = [
    {
      _id: "land_001",
      name: "Green Valley Estates",
      location: "Quezon City, Philippines",
      totalArea: 12000,
      totalLots: 40,
      available: 25,
      lotsSold: 15,
      createdAt: "2025-01-10T08:30:00Z",
    },
    {
      _id: "land_002",
      name: "Sunrise Hills",
      location: "Tagaytay, Philippines",
      totalArea: 8000,
      totalLots: 28,
      available: 10,
      lotsSold: 18,
      createdAt: "2025-02-05T14:10:00Z",
    },
    {
      _id: "land_003",
      name: "Lakeview Residences",
      location: "Batangas, Philippines",
      totalArea: 15000,
      totalLots: 50,
      available: 35,
      lotsSold: 15,
      createdAt: "2025-03-21T09:45:00Z",
    },
    {
      _id: "land_004",
      name: "Palm Grove Village",
      location: "Cebu City, Philippines",
      totalArea: 10000,
      totalLots: 32,
      available: 20,
      lotsSold: 12,
      createdAt: "2025-04-02T11:15:00Z",
    },
    {
      _id: "land_005",
      name: "Mountain View Residences",
      location: "Baguio City, Philippines",
      totalArea: 9000,
      totalLots: 30,
      available: 14,
      lotsSold: 16,
      createdAt: "2025-04-15T13:20:00Z",
    },
    {
      _id: "land_006",
      name: "Harborfront Estates",
      location: "Iloilo City, Philippines",
      totalArea: 11000,
      totalLots: 36,
      available: 21,
      lotsSold: 15,
      createdAt: "2025-05-01T09:00:00Z",
    },
    {
      _id: "land_007",
      name: "Golden Fields",
      location: "Davao City, Philippines",
      totalArea: 14000,
      totalLots: 45,
      available: 28,
      lotsSold: 17,
      createdAt: "2025-05-22T16:40:00Z",
    },
    {
      _id: "land_008",
      name: "Horizon Park",
      location: "Laguna, Philippines",
      totalArea: 9500,
      totalLots: 31,
      available: 18,
      lotsSold: 13,
      createdAt: "2025-06-03T07:50:00Z",
    },
    {
      _id: "land_009",
      name: "Silver Creek Residences",
      location: "Cavite, Philippines",
      totalArea: 10500,
      totalLots: 34,
      available: 19,
      lotsSold: 15,
      createdAt: "2025-06-18T12:25:00Z",
    },
    {
      _id: "land_010",
      name: "Blue Ridge Heights",
      location: "Antipolo, Philippines",
      totalArea: 11500,
      totalLots: 37,
      available: 22,
      lotsSold: 15,
      createdAt: "2025-07-05T10:10:00Z",
    },
    {
      _id: "land_011",
      name: "Crystal Springs",
      location: "Pampanga, Philippines",
      totalArea: 9800,
      totalLots: 29,
      available: 15,
      lotsSold: 14,
      createdAt: "2025-07-22T14:45:00Z",
    },
    {
      _id: "land_012",
      name: "Emerald Meadows",
      location: "Nueva Ecija, Philippines",
      totalArea: 13200,
      totalLots: 42,
      available: 27,
      lotsSold: 15,
      createdAt: "2025-08-01T09:30:00Z",
    },
    {
      _id: "land_013",
      name: "Sunset Ridge",
      location: "Palawan, Philippines",
      totalArea: 8700,
      totalLots: 26,
      available: 12,
      lotsSold: 14,
      createdAt: "2025-08-15T15:10:00Z",
    },
    {
      _id: "land_014",
      name: "Maple Grove",
      location: "Cagayan de Oro, Philippines",
      totalArea: 10800,
      totalLots: 33,
      available: 20,
      lotsSold: 13,
      createdAt: "2025-08-28T08:40:00Z",
    },
    {
      _id: "land_015",
      name: "Riverside Estates",
      location: "Zamboanga City, Philippines",
      totalArea: 12500,
      totalLots: 41,
      available: 26,
      lotsSold: 15,
      createdAt: "2025-09-05T17:00:00Z",
    },
    {
      _id: "land_016",
      name: "Cedar Hills",
      location: "Rizal, Philippines",
      totalArea: 9300,
      totalLots: 28,
      available: 13,
      lotsSold: 15,
      createdAt: "2025-09-12T07:25:00Z",
    },
    {
      _id: "land_017",
      name: "Highland Residences",
      location: "Bukidnon, Philippines",
      totalArea: 15000,
      totalLots: 48,
      available: 32,
      lotsSold: 16,
      createdAt: "2025-09-18T11:55:00Z",
    },
    {
      _id: "land_018",
      name: "Southwind Village",
      location: "General Santos, Philippines",
      totalArea: 9700,
      totalLots: 30,
      available: 16,
      lotsSold: 14,
      createdAt: "2025-09-25T10:15:00Z",
    },
    {
      _id: "land_019",
      name: "Vista Verde",
      location: "Bulacan, Philippines",
      totalArea: 11200,
      totalLots: 35,
      available: 20,
      lotsSold: 15,
      createdAt: "2025-10-02T13:40:00Z",
    },
    {
      _id: "land_020",
      name: "Golden Horizon",
      location: "Tarlac, Philippines",
      totalArea: 11800,
      totalLots: 38,
      available: 23,
      lotsSold: 15,
      createdAt: "2025-10-12T09:05:00Z",
    },
  ];

  const saveHandler = () => {
    if (!selectedLand) return;
    selectedData(selectedLand);
    onClose();
  };

  // ✅ Filter + Sort
  const filteredLands = useMemo(() => {
    let lands = mockLands.filter(
      (land) =>
        land.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        land.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortBy === "name") {
      lands = [...lands].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "area") {
      lands = [...lands].sort((a, b) => b.totalArea - a.totalArea);
    }
    return lands;
  }, [searchQuery, sortBy]);

  // ✅ Handle checkbox
  const toggleSelection = (data: LandTypes) => {
    setSelectedLand((prev) => {
      if (!prev) {
        return data;
      } else if (prev && prev._id !== data._id) {
        return data;
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="relative w-full p-4 overflow-y-auto bg-white rounded-3xl dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Select Land
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Please choose a land property to associate with this sale
            transaction.
          </p>
        </div>

        <Filter
          onSearchChange={setSearchQuery}
          SearchPlaceholder="Search land..."
          onSortChange={setSortBy}
        />

        {/* Fixed height table container */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="h-80 overflow-y-auto custom-scrollbar">
            <Table className="min-w-full">
              <TableHeader className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 bg-white dark:bg-gray-900 min-w-[200px]"
                  >
                    Land Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 bg-white dark:bg-gray-900 min-w-[100px]"
                  >
                    Total Area
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 bg-white dark:bg-gray-900 min-w-[120px]"
                  >
                    Available Lots
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 bg-white dark:bg-gray-900 min-w-[80px]"
                  >
                    Select
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {filteredLands.length > 0 ? (
                  filteredLands.map((land) => (
                    <TableRow
                      key={land._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      
                    >
                      {/* Land Name + Location */}
                      <TableCell className="px-3 py-4 text-start min-w-[200px]">
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {land.name}
                          </span>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                            {land.location}
                          </span>
                        </div>
                      </TableCell>

                      {/* Total Area */}
                      <TableCell className="px-3 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 min-w-[100px]">
                        {land.totalArea.toLocaleString()} sqm
                      </TableCell>

                      {/* Available Lots */}
                      <TableCell className="px-3 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 min-w-[120px]">
                        {land.available}
                      </TableCell>

                      {/* Checkbox */}
                      <TableCell className="px-3 py-3 min-w-[80px]">
                        <Checkbox
                          checked={land._id === selectedLand?._id}
                          onChange={() => toggleSelection(land)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className="px-3 py-6 text-center text-gray-500 dark:text-gray-400">
                      No lands found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
          <Button size="sm" variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button size="sm" type="submit" onClick={saveHandler}>
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LandSelectionModal;
