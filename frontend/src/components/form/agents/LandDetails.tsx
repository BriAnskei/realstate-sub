import { SetStateAction, useEffect, useRef, useState } from "react";
import {
  getLandById,
  LandTypes,
  resetLandFilter,
  resetLands,
  searchLand,
} from "../../../store/slices/landSlice";
import ComponentCard from "../../common/ComponentCard";
import Button from "../../ui/button/Button";
import Input from "../input/InputField";
import Label from "../Label";
import LandSelectionModal from "../../modal/saleModal/LandSelectionModal";
import { ApplicationType } from "../../../store/slices/applicationSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { useFilteredData } from "../../../hooks/useFilteredData";
import { debouncer } from "../../../utils/debouncer";

interface LandDetailProp {
  setApplication: React.Dispatch<React.SetStateAction<ApplicationType>>;

  // form update prop
  selectedLandId?: string;
}

const LandDetails = ({ setApplication, selectedLandId }: LandDetailProp) => {
  const dispatch = useDispatch<AppDispatch>();
  const { byId, allIds, filterById, filterIds, filterLoading } = useSelector(
    (state: RootState) => state.land
  );
  const [selectedLand, setSelectedLand] = useState<LandTypes | undefined>(
    undefined
  );
  const [isLandModalOpen, setIsLandModalOpen] = useState(false);

  // filter
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [searchLoading, setSearchLoading] = useState(false);
  const debouncedSearchRef = useRef<ReturnType<typeof debouncer> | null>(null);

  useEffect(() => {
    async function fetchSelectedLand() {
      try {
        if (selectedLandId) {
          const response = await dispatch(getLandById(selectedLandId)).unwrap();

          if (!response.success) {
            console.log(response.message ?? "Failed to fetch land");
          }
          setSelectedLand(response.land!);
        }
      } catch (error) {
        console.log("Failed to fetch land:", error);
      }
    }
    fetchSelectedLand();
  }, [selectedLandId]);

  useEffect(() => {
    if (selectedLand) {
      setApplication((prev) => ({
        ...prev,
        landId: selectedLand._id,
        landName: selectedLand.name,
      }));
    }
  }, [selectedLand]);

  debouceSearchHanlder();
  useEffect(() => {
    if (searchQuery?.trim()) {
      setSearchLoading(true);
      debouncedSearchRef.current!(searchQuery);
    } else {
      dispatch(resetLandFilter());
    }
  }, [searchQuery]);

  const getData = useFilteredData<LandTypes>({
    originalData: { byId, allIds },
    filteredData: { byId: filterById, allIds: filterIds },
    filterOptions: {
      searchInput: searchQuery,
      filterLoading: filterLoading || searchLoading,
    },
  });

  return (
    <>
      <ComponentCard
        className="mb-7"
        title="Land Details"
        actions={[
          <Button
            className="inline-flex items-center justify-center gap-2 rounded-lg transition  px-4 py-3 text-sm  text-white  bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
            onClick={() => setIsLandModalOpen(true)}
          >
            Select Land
          </Button>,
        ]}
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <Label>Project Name</Label>
            <Input
              readonly
              type="text"
              value={selectedLand?.name ?? ""}
              name="name"
              placeholder="Land Name will display here"
            />
          </div>

          <div>
            <Label>Locations</Label>
            <Input
              readonly
              type="text"
              value={selectedLand?.location ?? ""}
              name="name"
              placeholder="Land Location"
            />
          </div>
        </div>
      </ComponentCard>
      <LandSelectionModal
        selectedData={setSelectedLand}
        isOpen={isLandModalOpen}
        onClose={() => setIsLandModalOpen(false)}
        byId={getData.byId}
        allIds={getData.allIds}
        filterLoading={filterLoading || searchLoading}
        setSearchQuery={setSearchQuery}
        selectedLandData={selectedLand}
      />
    </>
  );

  function debouceSearchHanlder() {
    if (!debouncedSearchRef.current) {
      debouncedSearchRef.current = debouncer(async (searchQuery: string) => {
        try {
          console.log("seartch landd: ", searchQuery);

          await dispatch(searchLand(searchQuery));
        } catch (error) {
          console.log(error);
        } finally {
          setSearchLoading(false);
        }
      }, 400);
    }
  }
};

export default LandDetails;
