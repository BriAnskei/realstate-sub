import { useState, useEffect } from "react";
import { createChangeHandler } from "../../../utils/createChangeHandler";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import { LotType } from "../../../store/slices/lotSlice";
import Radio from "../../form/input/Radio";

interface LotFormModalProp {
  isOpen: boolean;
  onClose: () => void;
  data?: LotType;
  saveLot: (data: LotType) => void;
  saveUpdate: (newData: LotType) => void;
}

const initialValue: LotType = {
  _id: "",
  LandId: "",
  blockNumber: "",
  lotNumber: "",
  lotSize: "",
  pricePerSqm: "",
  totalAmount: "",
  lotType: "",
  lotStatus: "available",
};

const LotFormModal = ({
  isOpen,
  onClose,
  data,
  saveLot,
  saveUpdate,
}: LotFormModalProp) => {
  const [totalAmount, setTotalAmount] = useState("");
  const [inputData, setInputData] = useState<LotType>(initialValue);

  useEffect(() => {
    if (isOpen) {
      if (data) {
        setInputData(data);
      }
    } else {
      // reset input values if closed
      setInputData(initialValue);
      setTotalAmount("");
    }
  }, [isOpen, data]);

  useEffect(() => {
    const productAmount = () => {
      if (inputData.lotSize && inputData.pricePerSqm) {
        setTimeout(() => {
          setTotalAmount(
            (
              parseInt(inputData.lotSize!, 10) *
              parseInt(inputData.pricePerSqm!, 10)
            ).toString()
          );

          setInputData((prev) => ({
            ...prev,
            totalAmount: (
              Number(inputData.lotSize) * Number(inputData.pricePerSqm)
            ).toString(),
          }));
        }, 400);
      }
    };
    productAmount();
  }, [inputData.lotSize, inputData.pricePerSqm]);

  const onChangeHanlder = createChangeHandler(setInputData);

  const handleRadioChange = (value: string) => {
    setInputData((prev) => ({ ...prev, lotStatus: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (data) {
      saveUpdate(inputData);
    } else {
      saveLot(inputData);
    }

    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        className="max-w-[700px] m-4"
      >
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {data ? "Update Lot" : "Project Lot"}
            </h4>
          </div>
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="px-2 overflow-y-auto custom-scrollbar p-2">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Block Number</Label>
                  <Input
                    type="text"
                    value={inputData.blockNumber}
                    name="blockNumber"
                    placeholder="e.g. 5"
                    onChange={onChangeHanlder}
                  />
                </div>

                <div>
                  <Label>Lot Number</Label>
                  <Input
                    type="number"
                    value={inputData.lotNumber}
                    name="lotNumber"
                    placeholder="e.g. 12"
                    onChange={onChangeHanlder}
                  />
                </div>

                <div>
                  <Label>Lot Size (sqm)</Label>
                  <Input
                    type="number"
                    value={inputData.lotSize}
                    className="dark:[color-scheme:dark]"
                    name="lotSize"
                    placeholder="e.g. 120"
                    onChange={onChangeHanlder}
                  />
                </div>

                <div>
                  <Label>Price per sqm</Label>
                  <Input
                    type="number"
                    className="dark:[color-scheme:dark]"
                    value={inputData.pricePerSqm}
                    name="pricePerSqm"
                    placeholder="e.g. 1,500"
                    onChange={onChangeHanlder}
                  />
                </div>

                <div>
                  <Label>Total Amount (auto-generated)</Label>
                  <Input
                    readonly
                    type="number"
                    className="dark:[color-scheme:dark]"
                    value={totalAmount}
                    name="totalAmount"
                    placeholder="Generated Total Amount"
                    onChange={onChangeHanlder}
                  />
                </div>

                <div>
                  <Label>Lot Type</Label>
                  <Input
                    type="text"
                    value={inputData.lotType}
                    name="lotType"
                    placeholder="e.g. Residential, Commercial"
                    onChange={onChangeHanlder}
                  />
                </div>

                <div className="lg:col-span-2">
                  <Label>Status</Label>
                  <div className="flex flex-wrap items-center gap-8 mt-3">
                    <Radio
                      id="available"
                      name="status"
                      value="available"
                      label="Available"
                      checked={inputData.lotStatus === "available"}
                      onChange={handleRadioChange}
                    />
                    <Radio
                      id="reserved"
                      name="status"
                      value="reserved"
                      label="Reserved"
                      checked={inputData.lotStatus === "reserved"}
                      onChange={handleRadioChange}
                    />
                    <Radio
                      id="sold"
                      name="status"
                      value="sold"
                      label="Sold"
                      checked={inputData.lotStatus === "sold"}
                      onChange={handleRadioChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={handleClose}
                type="button"
              >
                Close
              </Button>
              <Button size="sm" type="submit">
                {data ? "Update Lot" : "Add Lot"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default LotFormModal;
