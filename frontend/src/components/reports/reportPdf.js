import jsPDF from "jspdf";

const MARGIN = 14;
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;

const clean = (value) => {
    if (value === null || value === undefined || value === "") return "-";
    return String(value).replace(/\s+/g, " ").trim();
};

const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? clean(value) : date.toLocaleString();
};

const addHeader = (doc, title, subtitle) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(clean(title), MARGIN, 18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(90);
    if (subtitle) doc.text(clean(subtitle), MARGIN, 25);
    doc.text(`Generated: ${new Date().toLocaleString()}`, PAGE_WIDTH - MARGIN, 18, {
        align: "right",
    });
    doc.setTextColor(0);

    return 33;
};

const addFooter = (doc) => {
    const pageCount = doc.getNumberOfPages();
    for (let page = 1; page <= pageCount; page += 1) {
        doc.setPage(page);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(`Page ${page} of ${pageCount}`, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 8, {
            align: "right",
        });
        doc.setTextColor(0);
    }
};

const drawTable = (doc, columns, rows, startY) => {
    const usableWidth = PAGE_WIDTH - MARGIN * 2;
    const totalWeight = columns.reduce((sum, column) => sum + (column.weight || 1), 0);
    const widths = columns.map(
        (column) => usableWidth * ((column.weight || 1) / totalWeight)
    );

    const headerHeight = 9;
    const lineHeight = 4.5;
    const fontSize = columns.length >= 7 ? 6.5 : columns.length >= 5 ? 7.5 : 8.5;
    let y = startY;

    const drawHeader = () => {
        doc.setFillColor(15, 23, 42);
        doc.rect(MARGIN, y, usableWidth, headerHeight, "F");
        doc.setTextColor(255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(fontSize);

        let x = MARGIN;
        columns.forEach((column, index) => {
            doc.text(clean(column.label), x + 2, y + 6, {
                maxWidth: widths[index] - 4,
            });
            x += widths[index];
        });

        y += headerHeight;
        doc.setTextColor(0);
    };

    drawHeader();

    rows.forEach((row, rowIndex) => {
        const values = columns.map((column) => clean(column.value(row, rowIndex)));
        const lineCounts = values.map((value, index) =>
            Math.max(
                1,
                doc.splitTextToSize(value, Math.max(10, widths[index] - 4)).length
            )
        );
        const rowHeight = Math.max(8, Math.max(...lineCounts) * lineHeight + 3);

        if (y + rowHeight > PAGE_HEIGHT - 15) {
            doc.addPage();
            y = 18;
            drawHeader();
        }

        if (rowIndex % 2 === 0) {
            doc.setFillColor(248, 250, 252);
            doc.rect(MARGIN, y, usableWidth, rowHeight, "F");
        }

        doc.setDrawColor(220, 225, 230);
        doc.rect(MARGIN, y, usableWidth, rowHeight);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(fontSize);

        let x = MARGIN;
        values.forEach((value, index) => {
            const wrapped = doc.splitTextToSize(value, Math.max(10, widths[index] - 4));
            doc.text(wrapped, x + 2, y + 5.5, {
                maxWidth: widths[index] - 4,
            });
            x += widths[index];
        });

        y += rowHeight;
    });

    return y;
};

export const downloadReportPdf = ({
    title,
    subtitle,
    filename,
    filters,
    columns,
    rows,
}) => {
    const doc = new jsPDF({
        orientation: columns.length >= 7 ? "landscape" : "portrait",
        unit: "mm",
        format: "a4",
    });

    const pageWidth = columns.length >= 7 ? 297 : 210;
    const pageHeight = columns.length >= 7 ? 210 : 297;

    // Keep the same A4 layout constants usable for portrait/landscape.
    const originalWidth = PAGE_WIDTH;
    const originalHeight = PAGE_HEIGHT;
    void originalWidth;
    void originalHeight;

    let y = 18;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(clean(title), MARGIN, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(90);
    if (subtitle) doc.text(clean(subtitle), MARGIN, y + 7);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - MARGIN, y, {
        align: "right",
    });

    y += subtitle ? 16 : 10;

    if (filters) {
        doc.setFontSize(8);
        doc.text(clean(filters), MARGIN, y);
        y += 7;
    }

    const usableWidth = pageWidth - MARGIN * 2;
    const totalWeight = columns.reduce((sum, column) => sum + (column.weight || 1), 0);
    const widths = columns.map(
        (column) => usableWidth * ((column.weight || 1) / totalWeight)
    );
    const headerHeight = 9;
    const lineHeight = 4.5;
    const fontSize = columns.length >= 7 ? 6.5 : columns.length >= 5 ? 7.5 : 8.5;

    const drawTableHeader = () => {
        doc.setFillColor(15, 23, 42);
        doc.rect(MARGIN, y, usableWidth, headerHeight, "F");
        doc.setTextColor(255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(fontSize);

        let x = MARGIN;
        columns.forEach((column, index) => {
            doc.text(clean(column.label), x + 2, y + 6, {
                maxWidth: widths[index] - 4,
            });
            x += widths[index];
        });
        y += headerHeight;
        doc.setTextColor(0);
    };

    drawTableHeader();

    rows.forEach((row, rowIndex) => {
        const values = columns.map((column) => clean(column.value(row, rowIndex)));
        const wrappedValues = values.map((value, index) =>
            doc.splitTextToSize(value, Math.max(10, widths[index] - 4))
        );
        const rowHeight = Math.max(
            8,
            Math.max(...wrappedValues.map((lines) => lines.length)) * lineHeight + 3
        );

        if (y + rowHeight > pageHeight - 15) {
            doc.addPage();
            y = 18;
            drawTableHeader();
        }

        if (rowIndex % 2 === 0) {
            doc.setFillColor(248, 250, 252);
            doc.rect(MARGIN, y, usableWidth, rowHeight, "F");
        }

        doc.setDrawColor(220, 225, 230);
        doc.rect(MARGIN, y, usableWidth, rowHeight);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(fontSize);

        let x = MARGIN;
        wrappedValues.forEach((lines, index) => {
            doc.text(lines, x + 2, y + 5.5, {
                maxWidth: widths[index] - 4,
            });
            x += widths[index];
        });
        y += rowHeight;
    });

    const pageCount = doc.getNumberOfPages();
    for (let page = 1; page <= pageCount; page += 1) {
        doc.setPage(page);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(`Page ${page} of ${pageCount}`, pageWidth - MARGIN, pageHeight - 8, {
            align: "right",
        });
        doc.setTextColor(0);
    }

    doc.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
};
