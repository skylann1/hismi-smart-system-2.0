/**
 * Excel Export Utility
 * 
 * Simple utility to export data to Excel format
 * First install: npm install xlsx
 */

import * as XLSX from 'xlsx';

export interface ExcelColumn {
    header: string;
    key: string;
    width?: number;
}

export interface ExcelExportOptions {
    filename: string;
    sheetName?: string;
    columns: ExcelColumn[];
    data: Record<string, unknown>[];
}

/**
 * Export data to Excel file
 */
export function exportToExcel(options: ExcelExportOptions) {
    const { filename, sheetName = 'Sheet1', columns, data } = options;

    // Create worksheet data
    const worksheetData = [
        // Header row
        columns.map(col => col.header),
        // Data rows
        ...data.map(row =>
            columns.map(col => {
                const value = row[col.key];
                // Handle different data types
                if (value === null || value === undefined) return '';
                if (typeof value === 'object') return JSON.stringify(value);
                return value;
            })
        )
    ];

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths
    worksheet['!cols'] = columns.map(col => ({
        wch: col.width || 15
    }));

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, `${filename}.xlsx`);
}

/**
 * Format date for Excel export
 */
export function formatDateForExcel(date: Date | string): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Format status for Excel
 */
export function formatStatusForExcel(status: string): string {
    const statusMap: Record<string, string> = {
        'hadir': 'Hadir',
        'izin': 'Izin',
        'sakit': 'Sakit',
        'absen': 'Tidak Hadir'
    };
    return statusMap[status] || status;
}
