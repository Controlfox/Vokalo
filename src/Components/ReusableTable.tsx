import React from "react";
import PropTypes from "prop-types";

/**
 * @param {string[]} columns - Lista på kolumnnamn Keys
 * @param {object[]} data - Array med objekt som visas som rader
 */

type ReusableTableProps = {
    columns: string[];
    data: Record<string, any>[];
};

export const ReusableTable: React.FC<ReusableTableProps> = ({ columns, data}) => (
    <table>
        <thead>
            <tr>
                {columns.map((col) => (
                    <th key={col}>{col}</th>
                ))}
            </tr>
        </thead>
        <tbody>
            {data.map((row, i) => (
                <tr key={i}>
                    {columns.map((col) => (
                        <td key={col}>{row[col]}</td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
);

ReusableTable.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ReusableTable;
