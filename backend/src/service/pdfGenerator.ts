import PDFDocument from "pdfkit";
import { ApplicationType } from "../model/applicationModel";
import { Client } from "../model/clientModel";
import { Database } from "sqlite";
import { AppService } from "./applictionService";
import { ClientService } from "./ClientService";
import { Land } from "../model/landModel";
import { Lot } from "../model/lotModel";
import { LandService } from "./landService";
import { LotService } from "./lot.service";

export class PdfService {
  private static async getGeneratorPayload(
    db: Database,
    payload: { applicationId: string; clientId: string }
  ): Promise<{
    application: ApplicationType;
    client: Client;
    land: Land;
    lots: Lot[];
  }> {
    const { applicationId, clientId } = payload;

    const application = await AppService.findById(
      db,
      parseInt(applicationId, 10)
    );

    if (!application) throw new Error("Cannot find application");

    const client = await ClientService.fintById(db, clientId);

    const land = await LandService.findById(db, application.landId);

    const lots = await LotService.getLotsByIds(db, application.lotIds);

    if (!land || !client || !lots || lots.length === 0) {
      let notFound = "";

      if (!client) notFound = "client";
      if (!land) notFound = "land";
      if (!lots || lots.length === 0) notFound = "lots";

      throw new Error(`Cannot find ${notFound}`);
    }
    return { application, client, land, lots };
  }

  static async generateContractPDF(
    db: Database,
    payload: {
      clientId: string;
      applicationId: string;
      term?: string;
    }
  ): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        const { term, applicationId, clientId } = payload;
        const payloadFetchResponse = await this.getGeneratorPayload(db, {
          applicationId,
          clientId,
        });

        const { application, client, land, lots } = payloadFetchResponse;

        const doc = new PDFDocument({
          size: "A4",
          margins: { top: 50, bottom: 50, left: 50, right: 50 },
        });

        const chunks: Buffer[] = [];
        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => {
          const pdfBuffer = Buffer.concat(chunks);
          resolve(pdfBuffer);
        });

        // Helper functions
        const addLine = (y: number, lineWidth = 1) => {
          doc.lineWidth(lineWidth);
          doc.moveTo(50, y).lineTo(545, y).stroke();
          doc.lineWidth(1);
        };

        const addBox = (
          x: number,
          y: number,
          width: number,
          height: number
        ) => {
          doc.rect(x, y, width, height).stroke();
        };

        const formatDate = (dateString: string) => {
          const date = new Date(dateString);
          return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        };

        const formatCurrency = (amount: number): string => {
          return `PHP ${amount.toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
        };

        const addSection = (title: string) => {
          doc.fontSize(12).font("Helvetica-Bold").text(title).moveDown(0.3);
          addLine(doc.y);
          doc.moveDown(0.5);
        };

        // Calculate totals
        const totalLotSize = lots.reduce((sum, lot) => sum + lot.lotSize, 0);
        const totalAmount = lots.reduce((sum, lot) => sum + lot.totalAmount, 0);

        // HEADER
        doc
          .fontSize(22)
          .font("Helvetica-Bold")
          .text("REAL ESTATE SALES CONTRACT", { align: "center" })
          .moveDown(0.3);

        addLine(doc.y, 2);
        doc.moveDown(0.5);

        doc
          .fontSize(9)
          .font("Helvetica")
          .text(`Contract Reference: ${application._id || "N/A"}`, {
            align: "center",
          })
          .text(`Contract Date: ${formatDate(new Date().toISOString())}`, {
            align: "center",
          })
          .text(`Application Status: ${application.status.toUpperCase()}`, {
            align: "center",
          })
          .moveDown(1.5);

        // PARTIES SECTION
        addSection("PARTIES TO THE CONTRACT");

        // Buyer Information
        doc.fontSize(11).font("Helvetica-Bold").text("BUYER INFORMATION:");
        doc.moveDown(0.3);

        const buyerStartY = doc.y;
        doc.fontSize(9).font("Helvetica");
        doc.text(`Full Name:`, 60);
        doc.text(
          `${client.firstName} ${client.middleName || ""} ${
            client.lastName
          }`.trim(),
          200,
          buyerStartY
        );

        doc.text(`Email Address:`, 60);
        doc.text(client.email || "N/A", 200, doc.y - 12);

        doc.text(`Contact Number:`, 60);
        doc.text(client.contact || "N/A", 200, doc.y - 12);

        doc.text(`Residential Address:`, 60);
        doc.text(client.address || "N/A", 200, doc.y - 12, { width: 295 });

        doc.text(`Marital Status:`, 60);
        doc.text(client.Marital || "N/A", 200, doc.y - 12);

        doc.text(`Client ID:`, 60);
        doc.text(client._id?.toString() || "N/A", 200, doc.y - 12);

        doc.moveDown(1);

        // Seller Information
        if (application.agentDealerId) {
          doc
            .fontSize(11)
            .font("Helvetica-Bold")
            .text("SELLER/AGENT INFORMATION:");
          doc.moveDown(0.3);
          doc.fontSize(9).font("Helvetica");
          doc.text(`Agent/Dealer ID: ${application.agentDealerId}`, 60);
          if (
            application.otherAgentIds &&
            application.otherAgentIds.length > 0
          ) {
            doc.text(`Co-Agents: ${application.otherAgentIds.join(", ")}`, 60);
          }
          doc.moveDown(1);
        }

        // PROPERTY DETAILS SECTION
        doc.fontSize(12).font("Helvetica-Bold").text("PROPERTY DETAILS", 60);
        doc.moveDown(0.3);
        addLine(doc.y);
        doc.moveDown(0.5);

        doc.fontSize(11).font("Helvetica-Bold").text("LAND INFORMATION:", 60);
        doc.moveDown(0.3);

        const landStartY = doc.y;
        doc.fontSize(9).font("Helvetica");
        doc.text(`Property Name:`, 60);
        doc.text(land.name, 200, landStartY);

        doc.text(`Location:`, 60);
        doc.text(land.location, 200, doc.y - 12, { width: 295 });

        doc.text(`Total Land Area:`, 60);
        doc.text(land.totalArea, 200, doc.y - 12);

        doc.text(`Total Lots:`, 60);
        doc.text(land.totalLots.toString(), 200, doc.y - 12);

        doc.text(`Available Lots:`, 60);
        doc.text(land.available.toString(), 200, doc.y - 12);

        doc.text(`Land ID:`, 60);
        doc.text(land._id?.toString() || "N/A", 200, doc.y - 12);

        doc.moveDown(1.5);

        // LOT DETAILS
        doc.fontSize(11).font("Helvetica-Bold").text("LOT DETAILS:", 60);
        doc.moveDown(0.5);

        // Table Header
        const tableTop = doc.y;
        const col1X = 60;
        const col2X = 110;
        const col3X = 160;
        const col4X = 250;
        const col5X = 360;
        const col6X = 480;
        const rowHeight = 22;

        doc.fontSize(9).font("Helvetica-Bold");
        doc.text("Block", col1X, tableTop);
        doc.text("Lot", col2X, tableTop);
        doc.text("Size (sqm)", col3X, tableTop);
        doc.text("Price/sqm", col4X, tableTop);
        doc.text("Total Amount", col5X, tableTop);
        doc.text("Type", col6X, tableTop);

        addLine(tableTop + 15);

        // Table Rows
        doc.font("Helvetica");
        let currentRowY = tableTop + 20;

        lots.forEach((lot, index) => {
          // Check if we need a new page
          if (currentRowY > 700) {
            doc.addPage();
            const newTableTop = 50;
            currentRowY = newTableTop + 20;

            doc.fontSize(9).font("Helvetica-Bold");
            doc.text("Block", col1X, newTableTop);
            doc.text("Lot", col2X, newTableTop);
            doc.text("Size (sqm)", col3X, newTableTop);
            doc.text("Price/sqm", col4X, newTableTop);
            doc.text("Total Amount", col5X, newTableTop);
            doc.text("Type", col6X, newTableTop);
            addLine(newTableTop + 15);
          }

          doc.fontSize(9).font("Helvetica");
          doc.text(lot.blockNumber.toString(), col1X, currentRowY, {
            width: 40,
            align: "left",
          });
          doc.text(lot.lotNumber.toString(), col2X, currentRowY, {
            width: 40,
            align: "left",
          });
          doc.text(lot.lotSize.toFixed(2), col3X, currentRowY, {
            width: 80,
            align: "left",
          });
          doc.text(formatCurrency(lot.pricePerSqm), col4X, currentRowY, {
            width: 100,
            align: "left",
          });
          doc.text(formatCurrency(lot.totalAmount), col5X, currentRowY, {
            width: 110,
            align: "left",
          });
          doc.text(lot.lotType, col6X, currentRowY, {
            width: 60,
            align: "left",
          });

          currentRowY += rowHeight;
        });

        const summaryY = currentRowY + 5;
        addLine(summaryY);

        doc.moveDown(0.8);
        doc.fontSize(10).font("Helvetica-Bold");
        doc.text(`Total Lot Size: ${totalLotSize.toFixed(2)} sqm`, 60, doc.y);
        const totalAmountY = doc.y - 12;
        doc.text(
          `TOTAL CONTRACT AMOUNT: ${formatCurrency(totalAmount)}`,
          60,
          totalAmountY + 15
        );

        doc.moveDown(1.5);

        // PAYMENT TERMS SECTION
        addSection("PAYMENT TERMS");

        doc.fontSize(9).font("Helvetica");
        doc.text(
          `Payment Schedule: ${term || "As agreed upon by both parties"}`,
          60,
          doc.y,
          { width: 495 }
        );
        doc.text(
          `Appointment Date: ${formatDate(application.appointmentDate)}`,
          60
        );
        doc.moveDown(1);

        // TERMS AND CONDITIONS
        addSection("TERMS AND CONDITIONS");

        const termsArr = [
          {
            title: "Purchase Price and Payment",
            content: `The total purchase price for the property is ${formatCurrency(
              totalAmount
            )}. The buyer agrees to pay this amount according to the payment schedule outlined above.`,
          },
          {
            title: "Property Transfer",
            content:
              "The seller agrees to transfer the property title to the buyer upon full payment of the agreed purchase price and completion of all contractual obligations. All necessary documentation will be provided within 30 days of final payment.",
          },
          {
            title: "Possession and Occupancy",
            content:
              "The buyer shall take possession of the property upon execution of this contract and payment of the initial deposit, unless otherwise specified in writing by both parties.",
          },
          {
            title: "Title and Warranties",
            content:
              "The seller warrants that the property is free from any liens, encumbrances, or legal disputes and has clear title to the property. The seller guarantees peaceful possession to the buyer.",
          },
          {
            title: "Default and Remedies",
            content:
              "In case of default by either party, the non-defaulting party shall have the right to terminate this agreement and seek appropriate legal remedies, including but not limited to specific performance or monetary damages.",
          },
          {
            title: "Force Majeure",
            content:
              "Neither party shall be liable for failure to perform their obligations due to circumstances beyond their reasonable control, including but not limited to acts of God, war, or government regulations.",
          },
          {
            title: "Governing Law and Jurisdiction",
            content:
              "This contract shall be governed by and construed in accordance with the laws of the jurisdiction where the property is located. Any disputes shall be resolved through binding arbitration or in the appropriate court.",
          },
          {
            title: "Entire Agreement",
            content:
              "This contract constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, or agreements, whether written or oral.",
          },
        ];

        doc.fontSize(9).font("Helvetica");
        termsArr.forEach((termItem, i) => {
          // Check if we need a new page
          if (doc.y > 680) {
            doc.addPage();
          }

          doc
            .font("Helvetica-Bold")
            .text(`${i + 1}. ${termItem.title}`, 60)
            .font("Helvetica")
            .text(termItem.content, 60, doc.y, { indent: 20, width: 495 })
            .moveDown(0.5);
        });

        // Add new page for signatures if needed
        if (doc.y > 600) {
          doc.addPage();
        }

        doc.moveDown(1);
        addLine(doc.y, 2);
        doc.moveDown(1);

        // SIGNATURES SECTION
        doc
          .fontSize(12)
          .font("Helvetica-Bold")
          .text("SIGNATURES", { align: "center" });
        doc.moveDown(1);

        const signatureY = doc.y;

        // Buyer Signature
        doc.fontSize(10).font("Helvetica-Bold");
        doc.text("BUYER:", 60, signatureY);
        doc.font("Helvetica").fontSize(9);

        addBox(60, signatureY + 15, 200, 60);
        doc.text("Signature Over Printed Name", 70, signatureY + 80);
        doc.text(
          `${client.firstName} ${client.middleName || ""} ${
            client.lastName
          }`.trim(),
          70,
          signatureY + 95,
          { width: 180 }
        );
        doc.text("Date: _________________", 70, signatureY + 110);

        // Seller Signature
        doc.fontSize(10).font("Helvetica-Bold");
        doc.text("SELLER/AUTHORIZED AGENT:", 335, signatureY);
        doc.font("Helvetica").fontSize(9);

        addBox(335, signatureY + 15, 200, 60);
        doc.text("Signature Over Printed Name", 345, signatureY + 80);
        doc.text("Authorized Representative", 345, signatureY + 95);
        doc.text("Date: _________________", 345, signatureY + 110);

        // Witnesses (if needed)
        doc.moveDown(8);
        const witnessY = doc.y;

        doc.fontSize(10).font("Helvetica-Bold");
        doc.text("WITNESS 1:", 60, witnessY);
        doc.font("Helvetica").fontSize(9);
        doc
          .moveTo(60, witnessY + 40)
          .lineTo(240, witnessY + 40)
          .stroke();
        doc.text("Signature Over Printed Name", 60, witnessY + 45);

        doc.fontSize(10).font("Helvetica-Bold");
        doc.text("WITNESS 2:", 335, witnessY);
        doc.font("Helvetica").fontSize(9);
        doc
          .moveTo(335, witnessY + 40)
          .lineTo(515, witnessY + 40)
          .stroke();
        doc.text("Signature Over Printed Name", 335, witnessY + 45);

        // Footer disclaimer
        doc.moveDown(2);
        doc
          .fontSize(7)
          .font("Helvetica-Oblique")
          .text(
            "This is a legally binding contract. Both parties acknowledge that they have read, understood, and agree to all terms and conditions stated herein. Please read carefully before signing. It is recommended to seek legal advice before entering into this agreement.",
            60,
            doc.y,
            { align: "center", width: 475 }
          );

        doc
          .fontSize(7)
          .font("Helvetica")
          .text(
            `Generated on: ${formatDate(
              new Date().toISOString()
            )} | Contract ID: ${application._id || "N/A"}`,
            60,
            doc.y + 10,
            { align: "center", width: 475 }
          );

        doc.end();
      } catch (error) {
        console.error("Error generating PDF:", error);
        reject(error);
      }
    });
  }
}
