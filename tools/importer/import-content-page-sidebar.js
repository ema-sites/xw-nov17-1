/* eslint-disable */
/* global WebImporter */

import breadcrumbParser from './parsers/breadcrumb.js';
import formParser from './parsers/form.js';
import cardsGalleryParser from './parsers/cards-gallery.js';
import videoDateSelectParser from './parsers/video-date-select.js';
import listingFilterParser from './parsers/listing-filter.js';
import noticeParser from './parsers/notice.js';
import tableDataParser from './parsers/table-data.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import cardsTeaserParser from './parsers/cards-teaser.js';
import columnsRelatedLinksParser from './parsers/columns-related-links.js';
import embedVideoParser from './parsers/embed-video.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import columnsParser from './parsers/columns.js';
import searchKeywordParser from './parsers/search-keyword.js';
import titleBarParser from './parsers/title-bar.js';
import tabsToolsParser from './parsers/tabs-tools.js';
import cardsIconParser from './parsers/cards-icon.js';
import cnvCleanupTransformer from './transformers/cnv-cleanup.js';
import cnvSectionsTransformer from './transformers/cnv-sections.js';

const PAGE_TEMPLATE = {
  "name": "content-page-sidebar",
  "urls": [
    "https://www.cnv.org/Business-Development",
    "https://www.cnv.org/Business-Development/Bid-Notices",
    "https://www.cnv.org/Business-Development/Bid-Notices/Fair-Wage-Policy",
    "https://www.cnv.org/Business-Development/Bid-Notices/Sustainable-Purchasing-Policy",
    "https://www.cnv.org/Business-Development/Building",
    "https://www.cnv.org/Business-Development/Building/Development-Cost-Charges",
    "https://www.cnv.org/Business-Development/Building/Energy-Efficient-Buildings-Initiative",
    "https://www.cnv.org/Business-Development/Building/Energy-Efficient-Buildings-Initiative/New-Buildings",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1036-Grand-Boulevard",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/114-118-and-122-132-West-15th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/115-East-18th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/115-East-1st-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/115-East-Keith-Road",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/115-West-Esplanade-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/119-East-2nd-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/120-East-14th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1220-St-Georges",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1225-East-Keith-Road",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/124-W-20th-St",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/125-145-East-13th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/125-East-20th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/125-Victory-Ship-Way",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/127-129-East-12th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1311-Lonsdale-Avenue",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/133-East-4th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1357-Jones-Avenue",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/140-West-19th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1421-Fell-Avenue",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/144-West-21st-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1441-St-Georges-Avenue",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/145-153-East-4th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/146-160-East-2nd-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/149-West-3rd-Street-old",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/150-East-8th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/151-East-Keith-Road",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1536-1550-Eastern-Avenue",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/154-East-17th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1540-Georges-Ave-and-215-235-East-16th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1540-Georges-Avenue-and-215-235-East-16th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1540-St-Georges",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1553-Sutherland-Avenue",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1612-St-Georges-Avenue",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1712-Lonsdale-Avenue",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2000-Wolfe-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2008-Westview",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2024-Mackay-Avenue",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2045-Fell-Avenue",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/205-St,-d-,-Patricks-Avenue",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/210-230-E-2nd-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2121-2129-2137-Chesterfield-Avenue",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/213-E-22nd-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/214-East-Esplanade",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/215-West-Keith-Road",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/216-East-3rd-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2212-St-Georges-Avenue",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/222-East-2nd-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/226-West-5th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/229-231-West-15th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/229-East-22nd-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/233-E-22nd-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/234-East-25th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/236-254-East-3rd-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2416-Western-Avenue",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/245-East-10th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/245-West-27th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/250-East-15th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2525-Lonsdale-Avenue",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/253-East-28th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2540-2590-Lonsdale-Avenue",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/259-East-23rd-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/259-West-Keith-Road",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/261-263-West-6th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2612-Lonsdale-Avenue",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/266-East-1st-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/273-279-E-6th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/275-East-2nd-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2762-Lonsdale-Avenue",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/309-311-West-1st-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/309-Kennard-Avenue",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/311-Moody-Avenue",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/311-West-14th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/317-West-20th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/321-West-4th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/322-West-14th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/328-East-14th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/328-West-14th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/332-East-24th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/332-West-16th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/333-West-20th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/341-347-West-4th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/341-West-24th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/350-East-2nd-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/351-West-3rd-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/352-West-15th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/357-East-22nd-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/364-East-14th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/365-East-22nd-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/365-West-19th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/380-East-1st-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/400-East-1st-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/402-438-East-3rd-St-and-341-343-St-Davids-Ave",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/407-West-16th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/412-East-11th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/412-East-5th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/417-West-14th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/422-East-1st-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/427-429-and-433-435-E-3rd-St",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/429-East-15th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/442-444-East-1st-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/442-East-16th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/450-West-15th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/452-East-1st-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/453-West-24th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/457-West-14th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/462-East-11th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/464-West-28th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/467-East-2nd-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/502-East-3rd-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/502-East-5th",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/509-East-6th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/528-East-7th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/540-West-21st-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/541-West-Keith-Road",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/548-558-East-1st-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/602-East-2nd",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/618-East-4th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/63-Mahon-Avenue",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/630-Brooksbank-Avenue",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/639-East-4th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/642-East-6th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/645-Mahon-Avenue",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/646-East-4th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/648-West-14th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/651-East-1st-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/652-East-4th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/705-717-West-15th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/720-Copping-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/758-762-East-3rd-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/758-Harbourside-Drive",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/758-Harbourside-Drive-Temporary-Use-Permit",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/800-Marine-Drive",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/818-858-West-15th-St",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/822-E-4th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/833-Automall-Drive",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/835---845-West-15th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/842-East-5th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/844-East-6th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/864-East-14th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/880-West-15th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/905-Ridgeway-Avenue",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/935-Marine-Drive",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/971-West-1st-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Development-Permits",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Development-Permits/Streamside-Development-Permit-Areas",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Planning-Application-Resources",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Planning-Application-Resources/Public-Works-and-Engineering-Servicing-Standards",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Planning-Applications",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Planning-Applications/Official-Community-Plan-Amendment-Application-Process",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Zoning",
    "https://www.cnv.org/Business-Development/Building/Leadership-in-Energy-and-Environmental-Design",
    "https://www.cnv.org/Business-Development/Building/Subdivisions",
    "https://www.cnv.org/Business-Development/Business-Licences",
    "https://www.cnv.org/Business-Development/Business-Licences/Applying-for-a-Business-Licence",
    "https://www.cnv.org/Business-Development/Business-Licences/BizPaL",
    "https://www.cnv.org/Business-Development/Business-Licences/Business-Licence-Bylaws",
    "https://www.cnv.org/Business-Development/Business-Licences/Food-Trucks",
    "https://www.cnv.org/Business-Development/Business-Licences/Inter-Municipal-Business-Licence",
    "https://www.cnv.org/Business-Development/Business-Licences/Monthly-Update-of-New-Businesses",
    "https://www.cnv.org/Business-Development/Business-Licences/Outdoor-Dining",
    "https://www.cnv.org/Business-Development/Business-Licences/Recreational-Cannabis-Retail",
    "https://www.cnv.org/Business-Development/Business-Licences/Short-Term-Rentals",
    "https://www.cnv.org/Business-Development/Economic-Development",
    "https://www.cnv.org/Business-Development/Economic-Development/Business-Improvement-Area",
    "https://www.cnv.org/Business-Development/Economic-Development/Business-Opportunities",
    "https://www.cnv.org/Business-Development/Economic-Development/Economic-Strategy",
    "https://www.cnv.org/Business-Development/Economic-Development/Invest",
    "https://www.cnv.org/Business-Development/Economic-Development/Invest/Competitive-Advantages",
    "https://www.cnv.org/Business-Development/Economic-Development/Invest/Resources-and-Support",
    "https://www.cnv.org/Business-Development/Economic-Development/Small-Business",
    "https://www.cnv.org/Business-Development/Filming-In-the-City",
    "https://www.cnv.org/Business-Development/Filming-In-the-City/Benefits-of-Filming",
    "https://www.cnv.org/Business-Development/Filming-In-the-City/Film-Bursary",
    "https://www.cnv.org/Business-Development/Filming-In-the-City/Film-Productions-in-the-City",
    "https://www.cnv.org/Business-Development/Filming-In-the-City/Filming-Checklist",
    "https://www.cnv.org/Business-Development/Filming-In-the-City/Filming-Locations",
    "https://www.cnv.org/Business-Development/Filming-In-the-City/Filming-Locations/Cemetery-Filming",
    "https://www.cnv.org/Business-Development/Filming-In-the-City/Filming-Locations/Filming-at-The-Shipyards",
    "https://www.cnv.org/Business-Development/Filming-In-the-City/Filming-Locations/Filming-in-City-Hall",
    "https://www.cnv.org/Business-Development/Filming-In-the-City/Filming-Locations/Your-Property-as-a-Film-Location",
    "https://www.cnv.org/Business-Development/Filming-In-the-City/Student-Filming",
    "https://www.cnv.org/Business-Development/Heritage",
    "https://www.cnv.org/Business-Development/Heritage/Heritage-Awards",
    "https://www.cnv.org/Business-Development/Lonsdale-Energy",
    "https://www.cnv.org/Business-Development/Permits-Inspections",
    "https://www.cnv.org/Business-Development/Permits-Inspections/Building-Permit-Statistical-Reports",
    "https://www.cnv.org/Business-Development/Permits-Inspections/Building-Permits",
    "https://www.cnv.org/Business-Development/Permits-Inspections/Building-Permits/Alternative-Solutions",
    "https://www.cnv.org/Business-Development/Permits-Inspections/Building-Permits/Commercial-Tenant-Improvement",
    "https://www.cnv.org/Business-Development/Permits-Inspections/Building-Permits/Demolition-Permits",
    "https://www.cnv.org/Business-Development/Permits-Inspections/Building-Permits/General-Building-Permit-Info",
    "https://www.cnv.org/Business-Development/Permits-Inspections/Building-Permits/Ground-Oriented-Housing",
    "https://www.cnv.org/Business-Development/Permits-Inspections/Building-Permits/How-to-Submit-Construction-Permits",
    "https://www.cnv.org/Business-Development/Permits-Inspections/Building-Permits/New-Coach-House",
    "https://www.cnv.org/Business-Development/Permits-Inspections/Building-Permits/New-Complex-Buildings",
    "https://www.cnv.org/Business-Development/Permits-Inspections/Building-Permits/New-Garages-Carports",
    "https://www.cnv.org/Business-Development/Permits-Inspections/Building-Permits/New-Single-and-Two-Family-Dwellings",
    "https://www.cnv.org/Business-Development/Permits-Inspections/Building-Permits/Residential-Renovation-Additions-Non-Strata",
    "https://www.cnv.org/Business-Development/Permits-Inspections/Building-Permits/Residential-Renovations-Strata",
    "https://www.cnv.org/Business-Development/Permits-Inspections/Building-Permits/Secondary-Suites",
    "https://www.cnv.org/Business-Development/Permits-Inspections/Building-Permits/Swimming-Pools",
    "https://www.cnv.org/Business-Development/Permits-Inspections/Electrical-Permit-Application-Forms-and-Information",
    "https://www.cnv.org/Business-Development/Permits-Inspections/Inspections",
    "https://www.cnv.org/Business-Development/Permits-Inspections/Plumbing-and-Gas-Permit-Application-Forms-and-Information",
    "https://www.cnv.org/Business-Development/Permits-Inspections/Sign-Permit-Application-Forms-and-Information",
    "https://www.cnv.org/Business-Development/Wireless-Communication",
    "https://www.cnv.org/Calendar-of-Events",
    "https://www.cnv.org/City-Hall",
    "https://www.cnv.org/City-Hall/About",
    "https://www.cnv.org/City-Hall/About/Awards",
    "https://www.cnv.org/City-Hall/About/Capital-Projects",
    "https://www.cnv.org/City-Hall/About/Capital-Projects/Harbour-Deck",
    "https://www.cnv.org/City-Hall/About/Capital-Projects/Harbourside-Waterfront-Development-Application",
    "https://www.cnv.org/City-Hall/About/Capital-Projects/Harry-Jerome-Community-Recreation-Centre",
    "https://www.cnv.org/City-Hall/About/Capital-Projects/Harry-Jerome-Community-Recreation-Centre/About-the-Centre",
    "https://www.cnv.org/City-Hall/About/Capital-Projects/Harry-Jerome-Community-Recreation-Centre/Construction",
    "https://www.cnv.org/City-Hall/About/Capital-Projects/Harry-Jerome-Community-Recreation-Centre/Explore-the-Project",
    "https://www.cnv.org/City-Hall/About/Capital-Projects/Harry-Jerome-Community-Recreation-Centre/Explore-the-Project/Key-Reports-to-Date",
    "https://www.cnv.org/City-Hall/About/Capital-Projects/Harry-Jerome-Community-Recreation-Centre/News-and-Updates",
    "https://www.cnv.org/City-Hall/About/Capital-Projects/Harry-Jerome-Community-Recreation-Centre/Opening-Celebration",
    "https://www.cnv.org/City-Hall/About/Capital-Projects/Harry-Jerome-Neighbourhood-Lands",
    "https://www.cnv.org/City-Hall/About/Capital-Projects/North-Shore-Neighbourhood-House-Site-Redevelopment",
    "https://www.cnv.org/City-Hall/About/Capital-Projects/Past-Projects",
    "https://www.cnv.org/City-Hall/About/Capital-Projects/Past-Projects/City-Operations-Centre-Redevelopment",
    "https://www.cnv.org/City-Hall/About/Capital-Projects/Past-Projects/Civic-Centre-Redevelopment",
    "https://www.cnv.org/City-Hall/About/Capital-Projects/Past-Projects/Duplex-Special-Study",
    "https://www.cnv.org/City-Hall/About/Capital-Projects/Past-Projects/Flicka-Gymnastics",
    "https://www.cnv.org/City-Hall/About/Capital-Projects/Past-Projects/Lonsdale-Great-Street-Project",
    "https://www.cnv.org/City-Hall/About/Capital-Projects/Past-Projects/Mahon-Park-Childcare-Centre-Fieldhouse",
    "https://www.cnv.org/City-Hall/About/Capital-Projects/Past-Projects/Moodyville-Development-Controls-Process",
    "https://www.cnv.org/City-Hall/About/Capital-Projects/Past-Projects/Silver-Harbour",
    "https://www.cnv.org/City-Hall/About/Capital-Projects/Past-Projects/The-Shipyards-Destination-Infrastructure-Project",
    "https://www.cnv.org/City-Hall/About/Capital-Projects/TransLink-Moodyville-Development",
    "https://www.cnv.org/City-Hall/About/Community-Statistics",
    "https://www.cnv.org/City-Hall/About/Departments",
    "https://www.cnv.org/City-Hall/About/Departments/Chief-Administrative-Officer",
    "https://www.cnv.org/City-Hall/About/Departments/City-Clerks",
    "https://www.cnv.org/City-Hall/About/Departments/Communications",
    "https://www.cnv.org/City-Hall/About/Departments/Engineering-Parks-and-Environment",
    "https://www.cnv.org/City-Hall/About/Departments/Finance",
    "https://www.cnv.org/City-Hall/About/Departments/People-and-Culture",
    "https://www.cnv.org/City-Hall/About/Departments/Planning-and-Development",
    "https://www.cnv.org/City-Hall/About/Departments/Public-Safety",
    "https://www.cnv.org/City-Hall/About/How-City-Hall-Works",
    "https://www.cnv.org/City-Hall/About/Maps",
    "https://www.cnv.org/City-Hall/About/Maps/Map-Catalogue",
    "https://www.cnv.org/City-Hall/About/New-Families-and-Residents",
    "https://www.cnv.org/City-Hall/About/Sister-Cities",
    "https://www.cnv.org/City-Hall/Bylaws",
    "https://www.cnv.org/City-Hall/Bylaws/Animal-Control",
    "https://www.cnv.org/City-Hall/Bylaws/Bylaw-Adjudication",
    "https://www.cnv.org/City-Hall/Bylaws/Bylaw-Complaints",
    "https://www.cnv.org/City-Hall/Bylaws/Bylaw-Enforcement",
    "https://www.cnv.org/City-Hall/Bylaws/Bylaw-Enforcement/Graffiti",
    "https://www.cnv.org/City-Hall/Bylaws/Bylaw-Enforcement/Smoking-Bylaw",
    "https://www.cnv.org/City-Hall/Bylaws/Noise-Control",
    "https://www.cnv.org/City-Hall/Careers",
    "https://www.cnv.org/City-Hall/Careers/Living-Wage",
    "https://www.cnv.org/City-Hall/Claims-and-Causes-of-Loss",
    "https://www.cnv.org/City-Hall/Claims-and-Causes-of-Loss/Causes-of-Loss",
    "https://www.cnv.org/City-Hall/Claims-and-Causes-of-Loss/Claims",
    "https://www.cnv.org/City-Hall/Committees",
    "https://www.cnv.org/City-Hall/Committees/Advisory-Design-Panel",
    "https://www.cnv.org/City-Hall/Committees/Advisory-Design-Panel/ADP-Agenda",
    "https://www.cnv.org/City-Hall/Committees/Advisory-Design-Panel/ADP-Minutes",
    "https://www.cnv.org/City-Hall/Committees/Advisory-Planning-Commission",
    "https://www.cnv.org/City-Hall/Committees/Advisory-Planning-Commission/APC-Agenda",
    "https://www.cnv.org/City-Hall/Committees/Advisory-Planning-Commission/APC-Minutes",
    "https://www.cnv.org/City-Hall/Committees/Board-of-Variance",
    "https://www.cnv.org/City-Hall/Committees/Board-of-Variance/Board-of-Variance-Agendas",
    "https://www.cnv.org/City-Hall/Committees/Board-of-Variance/Board-of-Variance-Meeting-Minutes",
    "https://www.cnv.org/City-Hall/Committees/Community-Safety-Advisory-Committee",
    "https://www.cnv.org/City-Hall/Committees/Community-Safety-Advisory-Committee/CSAC-Agenda",
    "https://www.cnv.org/City-Hall/Committees/Community-Safety-Advisory-Committee/CSAC-Minute",
    "https://www.cnv.org/City-Hall/Committees/Current-Vacancies-Committees-Commissions-and-Boards",
    "https://www.cnv.org/City-Hall/Committees/Heritage-Advisory-Committee",
    "https://www.cnv.org/City-Hall/Committees/Heritage-Advisory-Committee/Heritage-Advisory-Commission-Meeting-Minutes",
    "https://www.cnv.org/City-Hall/Committees/Heritage-Advisory-Committee/Heritage-Advisory-Committee-Agendas",
    "https://www.cnv.org/City-Hall/Committees/Integrated-Transportation-Committee",
    "https://www.cnv.org/City-Hall/Committees/Integrated-Transportation-Committee/Integrated-Transportation-Committee-Agendas",
    "https://www.cnv.org/City-Hall/Committees/Integrated-Transportation-Committee/Integrated-Transportation-Committee-Meeting-Minutes",
    "https://www.cnv.org/City-Hall/Committees/North-Shore-Accessibility-Advisory-Committee",
    "https://www.cnv.org/City-Hall/Committees/North-Vancouver-City-Library-Board",
    "https://www.cnv.org/City-Hall/Committees/North-Vancouver-Museum-and-Archives-Commission",
    "https://www.cnv.org/City-Hall/Committees/North-Vancouver-Policing-Committee",
    "https://www.cnv.org/City-Hall/Committees/North-Vancouver-Public-Art-Advisory-Committee",
    "https://www.cnv.org/City-Hall/Committees/North-Vancouver-Recreation-and-Culture-Commission",
    "https://www.cnv.org/City-Hall/Committees/Social-Planning-Advisory-Committee",
    "https://www.cnv.org/City-Hall/Committees/Social-Planning-Advisory-Committee/Social-Planning-Advisory-Committee-Agendas",
    "https://www.cnv.org/City-Hall/Committees/Social-Planning-Advisory-Committee/Social-Planning-Advisory-Committee-Meeting-Minutes",
    "https://www.cnv.org/City-Hall/Community-Engagement",
    "https://www.cnv.org/City-Hall/Community-Engagement/Informed",
    "https://www.cnv.org/City-Hall/Contact",
    "https://www.cnv.org/City-Hall/Contact/Complaints",
    "https://www.cnv.org/City-Hall/Contact/Respectful-Communication-Policy",
    "https://www.cnv.org/City-Hall/Contact/Social-Media",
    "https://www.cnv.org/City-Hall/Council-Meetings",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2012-Meetings",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2012-Meetings/Council-Videos",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2013-Meetings",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2013-Meetings/Council-Videos",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2014-Meetings",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2014-Meetings/Council-Videos",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2015-Meetings",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2015-Meetings/Council-Videos",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2016-Meetings",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2016-Meetings/Council-Videos",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2017-Meetings",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2017-Meetings/Council-Videos",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2018-Meetings",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2018-Meetings/Council-Videos",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2019-Meetings",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2019-Meetings/Council-Videos",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2020-Meetings",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2020-Meetings/Council-Videos",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2021-Meetings",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2021-Meetings/Council-Videos",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2022-Meetings",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2022-Meetings/Council-Videos",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2023-Meetings",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2023-Meetings/Council-Videos",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2024-Meetings",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2024-Meetings/Council-Videos",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2025-Meetings",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2025-Meetings/Council-Videos",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2026-Meetings",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2026-Meetings/Council-Videos",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Meeting-Live-Streaming",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Minutes-Archive",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Proclamations",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Videos",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Videos/2003-Council-Videos",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Videos/2004-Council-Videos",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Videos/2005-Council-Videos",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Videos/2006-Council-Videos",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Videos/2007-Council-Videos",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Videos/2008-Council-Videos",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Videos/2009-Council-Videos",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Videos/2010-Council-Videos",
    "https://www.cnv.org/City-Hall/Council-Meetings/Council-Videos/2011-Council-Videos",
    "https://www.cnv.org/City-Hall/Council-Meetings/Delegation-Process",
    "https://www.cnv.org/City-Hall/Council-Meetings/Public-Hearings-and-Public-Meetings/Finance-Committee-Minutes",
    "https://www.cnv.org/City-Hall/Council-Meetings/Public-Hearings-and-Public-Meetings/Policy-Committee-Minutes",
    "https://www.cnv.org/City-Hall/Council-Meetings/Public-Hearings-and-Public-Meetings/Public-Hearing-Minutes",
    "https://www.cnv.org/City-Hall/Council-Meetings/Public-Hearings-and-Public-Meetings/Public-Meeting-Minutes",
    "https://www.cnv.org/City-Hall/Council-Meetings/Public-Hearings-and-Public-Meetings/Upcoming-Public-Hearings-and-Meetings",
    "https://www.cnv.org/City-Hall/Council-Meetings/Public-Input-Period",
    "https://www.cnv.org/City-Hall/Council-Meetings/Public-Notices",
    "https://www.cnv.org/City-Hall/Council-Meetings/Report-of-Committee-of-the-Whole",
    "https://www.cnv.org/City-Hall/Finances",
    "https://www.cnv.org/City-Hall/Finances/Annual-Municipal-Report",
    "https://www.cnv.org/City-Hall/Finances/Financial-Plan",
    "https://www.cnv.org/City-Hall/Finances/Financial-Statements",
    "https://www.cnv.org/City-Hall/General-Local-Election",
    "https://www.cnv.org/City-Hall/General-Local-Election/2026-General-Local-Election",
    "https://www.cnv.org/City-Hall/General-Local-Election/Past-Election-Results",
    "https://www.cnv.org/City-Hall/Mayor-Council",
    "https://www.cnv.org/City-Hall/Mayor-Council/Council-Code-of-Conduct",
    "https://www.cnv.org/City-Hall/Mayor-Council/Council-Strategic-Plan",
    "https://www.cnv.org/City-Hall/Mayor-Council/Councillor-Angela-Girard",
    "https://www.cnv.org/City-Hall/Mayor-Council/Councillor-Don-Bell",
    "https://www.cnv.org/City-Hall/Mayor-Council/Councillor-Holly-Back",
    "https://www.cnv.org/City-Hall/Mayor-Council/Councillor-Shervin-Shahriari",
    "https://www.cnv.org/City-Hall/Mayor-Council/Councillor-Tony-Valente",
    "https://www.cnv.org/City-Hall/Mayor-Council/Mayor-Linda-Buchanan",
    "https://www.cnv.org/City-Hall/Mayor-Council/Mayor-Linda-Buchanan/Community-Updates",
    "https://www.cnv.org/City-Hall/News-Room",
    "https://www.cnv.org/City-Hall/News-Room/CityConnect-Subscription",
    "https://www.cnv.org/City-Hall/News-Room/CityView-eNewsletter",
    "https://www.cnv.org/City-Hall/News-Room/CityView-eNewsletter-Subscribe",
    "https://www.cnv.org/City-Hall/News-Room/News-Releases",
    "https://www.cnv.org/City-Hall/News-Room/News-Releases/2021/8/24/Shipyards-Receives-Top-Honours",
    "https://www.cnv.org/City-Hall/News-Room/News-Releases/2025/9/23/Nomad-Coffee-Selected-as-Caf%C3%A9-Operator-for-Future-Harry-Jerome-Community-Recreation-Centre",
    "https://www.cnv.org/City-Hall/News-Room/News-Releases/2026/10/21/Official-results-announced-for-the-2026-General-Local-Election--for-the-City-of-North-Vancouver",
    "https://www.cnv.org/City-Hall/News-Room/News-Releases/2026/3/4/New-Harry-Jerome-Community-Recreation-Centre-to-Open-July-2026",
    "https://www.cnv.org/City-Hall/News-Room/News-Releases/2026/3/5/Joint-Statement-from-Mayor-Linda-Buchanan,-CNV-and-Mayor-Mike-Little,-DNV",
    "https://www.cnv.org/City-Hall/News-Room/News-Releases/2026/6/23/Former-Mickey-MacDougall-Recreation-Centre-Reopens-Today-Following-Major-Energy-Upgrades",
    "https://www.cnv.org/City-Hall/News-Room/News-Releases/2026/6/3/New-HJCRC-and-Silver-Harbour-Seniors%E2%80%99-Activity-Centre-to-Open-July-25,-2026",
    "https://www.cnv.org/City-Hall/News-Room/News-Releases/2026/7/10/Joint-Statement-from-CNV-Mayor-Linda-Buchanan-and-DNV-Mayor-Mike-Little",
    "https://www.cnv.org/City-Hall/News-Room/News-Releases/2026/7/23/Maclean%E2%80%99s-Magazine-Highlights-Lower-Lonsdale-As-One-of-the-Coolest-Neighbourhoods-in-Canada",
    "https://www.cnv.org/City-Hall/News-Room/News-Releases/2026/7/25/City-of-North-Vancouver-opens-New-Harry-Jerome-Community-Recreation-Centre-Today",
    "https://www.cnv.org/City-Hall/News-Room/News-Releases/2026/8/20/City-of-North-Vancouver-opens-new-Crosscut-Bridge-today",
    "https://www.cnv.org/City-Hall/News-Room/Whats-New",
    "https://www.cnv.org/City-Hall/News-Room/Whats-New/2022/4/1/New-Harry-Jerome-Community-Recreation-Centre-is-Underway",
    "https://www.cnv.org/City-Hall/News-Room/Whats-New/2022/8/18/Federal-Funding-to-Retrofit-Mickey-McDougall-Community-Recreation-Centre",
    "https://www.cnv.org/City-Hall/News-Room/Whats-New/2026/10/26/Volunteer-for-a-Committee-and-Help-Shape-Your-Community",
    "https://www.cnv.org/City-Hall/News-Room/Whats-New/2026/11/3/Remembrance-Day-in-the-City",
    "https://www.cnv.org/City-Hall/News-Room/Whats-New/2026/11/5/Get-Ready-for-Winter-at-The-Shipyards",
    "https://www.cnv.org/City-Hall/News-Room/Whats-New/2026/8/28/Potential-service-impacts-for-building-permits-and-inspections",
    "https://www.cnv.org/City-Hall/Official-Community-Plan",
    "https://www.cnv.org/City-Hall/Online-Services",
    "https://www.cnv.org/City-Hall/Online-Services/CityCollect",
    "https://www.cnv.org/City-Hall/Online-Services/CityFix",
    "https://www.cnv.org/City-Hall/Online-Services/CityServe",
    "https://www.cnv.org/City-Hall/Online-Services/Dog-Licences",
    "https://www.cnv.org/City-Hall/Online-Services/Gateway",
    "https://www.cnv.org/City-Hall/Truth-and-Reconciliation",
    "https://www.cnv.org/Comments",
    "https://www.cnv.org/Community-Environment",
    "https://www.cnv.org/Community-Environment/Climate-Action",
    "https://www.cnv.org/Community-Environment/Climate-Action/Carbon-Fund",
    "https://www.cnv.org/Community-Environment/Climate-Action/Climate-Change-Adaptation",
    "https://www.cnv.org/Community-Environment/Climate-Action/Climate-Change-Adaptation/Building-Adaptive-and-Resilient-Communities-Program",
    "https://www.cnv.org/Community-Environment/Climate-Action/Climate-Environment-Strategy",
    "https://www.cnv.org/Community-Environment/Climate-Action/Climate-Targets",
    "https://www.cnv.org/Community-Environment/Climate-Action/Corporate-Climate-Action",
    "https://www.cnv.org/Community-Environment/Climate-Action/Street-Tree-Planting-Program",
    "https://www.cnv.org/Community-Environment/Energy",
    "https://www.cnv.org/Community-Environment/Energy/Jump-on-a-New-Heat-Pump-New",
    "https://www.cnv.org/Community-Environment/Environmental-Protection",
    "https://www.cnv.org/Community-Environment/Environmental-Protection/Air-Quality",
    "https://www.cnv.org/Community-Environment/Environmental-Protection/Invasive-Species",
    "https://www.cnv.org/Community-Environment/Environmental-Protection/Invasive-Species/Chafer-Beetle",
    "https://www.cnv.org/Community-Environment/Environmental-Protection/Invasive-Species/European-Fire-Ant",
    "https://www.cnv.org/Community-Environment/Environmental-Protection/Invasive-Species/Invasive-Plants",
    "https://www.cnv.org/Community-Environment/Environmental-Protection/Rain-Drains-Creeks",
    "https://www.cnv.org/Community-Environment/Environmental-Protection/Rain-Drains-Creeks/ISMP-Planning-101",
    "https://www.cnv.org/Community-Environment/Environmental-Protection/Rain-Drains-Creeks/Stormwater-Management-Overview",
    "https://www.cnv.org/Community-Environment/Environmental-Protection/Rain-Drains-Creeks/Watersheds-101",
    "https://www.cnv.org/Community-Environment/Environmental-Protection/Spill-Response",
    "https://www.cnv.org/Community-Environment/Environmental-Protection/Waste",
    "https://www.cnv.org/Community-Environment/Environmental-Protection/Waste/Cigarette-Waste",
    "https://www.cnv.org/Community-Environment/Environmental-Protection/Waste/On-Street-Recycling",
    "https://www.cnv.org/Community-Environment/Environmental-Protection/Waste/Poo-Fairy",
    "https://www.cnv.org/Community-Environment/Environmental-Protection/Water-Conservation",
    "https://www.cnv.org/Community-Environment/Environmental-Protection/Water-Conservation/Sprinkling-Regulations",
    "https://www.cnv.org/Community-Environment/Grants-Funding",
    "https://www.cnv.org/Community-Environment/Grants-Funding/Child-Care-Capital-Improvement-Fund",
    "https://www.cnv.org/Community-Environment/Grants-Funding/Children-and-Youth-Grants",
    "https://www.cnv.org/Community-Environment/Grants-Funding/Community-Grants",
    "https://www.cnv.org/Community-Environment/Grants-Funding/Culture-Makes-The-City-Grants",
    "https://www.cnv.org/Community-Environment/Grants-Funding/Housing-Initiatives-Grant",
    "https://www.cnv.org/Community-Environment/Grants-Funding/Special-Events-and-Festivals-Funding",
    "https://www.cnv.org/Community-Environment/Grants-Funding/Supportive-Funding-Review",
    "https://www.cnv.org/Community-Environment/Grants-Funding/Violence-Prevention-in-Schools-Grant",
    "https://www.cnv.org/Community-Environment/Help-Environment",
    "https://www.cnv.org/Community-Environment/Help-Environment/City-Park-Stewards",
    "https://www.cnv.org/Community-Environment/Help-Environment/Community-Cleanup",
    "https://www.cnv.org/Community-Environment/Help-Environment/Earth-Day",
    "https://www.cnv.org/Community-Environment/Help-Environment/Earth-Hour",
    "https://www.cnv.org/Community-Environment/Help-Environment/Rivers-Day",
    "https://www.cnv.org/Community-Environment/Help-Environment/Sustainable-Holidays",
    "https://www.cnv.org/Community-Environment/Housing",
    "https://www.cnv.org/Community-Environment/Housing/Active-Design",
    "https://www.cnv.org/Community-Environment/Housing/Adaptable-Design",
    "https://www.cnv.org/Community-Environment/Housing/Affordable-Housing",
    "https://www.cnv.org/Community-Environment/Housing/Family-Friendly-Housing",
    "https://www.cnv.org/Community-Environment/Housing/Homelessness",
    "https://www.cnv.org/Community-Environment/Housing/Housing-Accelerator-Fund",
    "https://www.cnv.org/Community-Environment/Housing/Housing-Action-Plan",
    "https://www.cnv.org/Community-Environment/Housing/Housing-Needs-Report",
    "https://www.cnv.org/Community-Environment/Housing/Housing-Target-Report",
    "https://www.cnv.org/Community-Environment/Housing/Provincial-Housing-Legislation-Updates",
    "https://www.cnv.org/Community-Environment/Housing/Provincial-Housing-Legislation-Updates/Bill-25,-c-,-Response-to-provincial-requirements",
    "https://www.cnv.org/Community-Environment/Housing/Provincial-Housing-Legislation-Updates/City-Lands-Planning",
    "https://www.cnv.org/Community-Environment/Housing/Provincial-Housing-Legislation-Updates/Growing-Livable-Neighbourhoods",
    "https://www.cnv.org/Community-Environment/Housing/Provincial-Housing-Legislation-Updates/Small-Scale-Housing-Changes",
    "https://www.cnv.org/Community-Environment/Housing/Rental-Housing",
    "https://www.cnv.org/Community-Environment/Housing/Tenant-Resources",
    "https://www.cnv.org/Community-Environment/Land-Use",
    "https://www.cnv.org/Community-Environment/Land-Use/Commercial",
    "https://www.cnv.org/Community-Environment/Land-Use/Density-Bonusing",
    "https://www.cnv.org/Community-Environment/Land-Use/Industrial",
    "https://www.cnv.org/Community-Environment/Land-Use/Institutional",
    "https://www.cnv.org/Community-Environment/Land-Use/Residential",
    "https://www.cnv.org/Community-Environment/Living-City",
    "https://www.cnv.org/Community-Environment/Living-City/Living-City-Awards",
    "https://www.cnv.org/Community-Environment/Living-City/Living-City-Grant",
    "https://www.cnv.org/Community-Environment/Open-Streets",
    "https://www.cnv.org/Community-Environment/Social-Planning",
    "https://www.cnv.org/Community-Environment/Social-Planning/Accessibility",
    "https://www.cnv.org/Community-Environment/Social-Planning/Child-Care",
    "https://www.cnv.org/Community-Environment/Social-Planning/Children-Youth-Families",
    "https://www.cnv.org/Community-Environment/Social-Planning/Community-Agencies",
    "https://www.cnv.org/Community-Environment/Social-Planning/Community-Agencies/Lions-Gate-Hospital",
    "https://www.cnv.org/Community-Environment/Social-Planning/Community-Wellbeing",
    "https://www.cnv.org/Community-Environment/Social-Planning/Community-Wellbeing/Social-Plan",
    "https://www.cnv.org/Community-Environment/Social-Planning/Complete-Communities-Assessment",
    "https://www.cnv.org/Community-Environment/Social-Planning/Cultural-Diversity",
    "https://www.cnv.org/Community-Environment/Social-Planning/Local-Food",
    "https://www.cnv.org/Community-Environment/Social-Planning/Local-Food/Community-Gardens",
    "https://www.cnv.org/Community-Environment/Social-Planning/Local-Food/Hobby-Bee-Keeping",
    "https://www.cnv.org/Community-Environment/Social-Planning/Local-Food/Loutet-Farm",
    "https://www.cnv.org/Community-Environment/Social-Planning/Local-Food/Pollinators",
    "https://www.cnv.org/Community-Environment/Social-Planning/Local-Food/Urban-Chicken-Keeping",
    "https://www.cnv.org/Community-Environment/Social-Planning/Poverty-Reduction-Strategy",
    "https://www.cnv.org/Community-Environment/Social-Planning/Seniors",
    "https://www.cnv.org/Community-Environment/Social-Planning/Youth",
    "https://www.cnv.org/Community-Environment/Social-Planning/Youth/CNV4ME",
    "https://www.cnv.org/Community-Environment/Social-Planning/Youth/CNV4ME/How-Our-City-Works",
    "https://www.cnv.org/Community-Environment/Social-Planning/Youth/CNV4ME/Kid-City",
    "https://www.cnv.org/Community-Environment/Social-Planning/Youth/CNV4ME/School-the-City",
    "https://www.cnv.org/Community-Environment/Social-Planning/Youth/Studio-in-the-City",
    "https://www.cnv.org/Community-Environment/Social-Planning/Youth/Youth-Awards-Scholarships",
    "https://www.cnv.org/Community-Environment/Social-Planning/Youth/Youth-Awards-Scholarships/Civic-Youth-Awards",
    "https://www.cnv.org/Community-Environment/Social-Planning/Youth/Youth-Awards-Scholarships/Youth-Centennial-Scholarship",
    "https://www.cnv.org/Community-Environment/Social-Planning/Youth/Youth-Week",
    "https://www.cnv.org/Community-Environment/Trees",
    "https://www.cnv.org/Community-Environment/Trees/Private-Trees",
    "https://www.cnv.org/Community-Environment/Trees/Public-Trees",
    "https://www.cnv.org/Community-Environment/Trees/Tree-Care",
    "https://www.cnv.org/Community-Environment/Trees/Urban-Forest",
    "https://www.cnv.org/Home-Property",
    "https://www.cnv.org/Home-Property/Emergency-Preparedness",
    "https://www.cnv.org/Home-Property/Emergency-Preparedness/Extreme-Cold",
    "https://www.cnv.org/Home-Property/Emergency-Preparedness/Extreme-Heat",
    "https://www.cnv.org/Home-Property/Emergency-Preparedness/Heavy-Rainfall",
    "https://www.cnv.org/Home-Property/Emergency-Preparedness/Snowfall",
    "https://www.cnv.org/Home-Property/Emergency-Preparedness/Storms",
    "https://www.cnv.org/Home-Property/Fire-Department",
    "https://www.cnv.org/Home-Property/Fire-Department/Commercial-Events",
    "https://www.cnv.org/Home-Property/Fire-Department/Fire-Danger-Rating",
    "https://www.cnv.org/Home-Property/Fire-Department/Fire-Safety-Prevention",
    "https://www.cnv.org/Home-Property/Fire-Department/Fire-Safety-Prevention/Halloween",
    "https://www.cnv.org/Home-Property/Fire-Department/Fire-Safety-Prevention/Holiday-Safety",
    "https://www.cnv.org/Home-Property/Fire-Department/FireSmart",
    "https://www.cnv.org/Home-Property/Fire-Department/Public-Education",
    "https://www.cnv.org/Home-Property/Garbage-Recycling-Green-Can",
    "https://www.cnv.org/Home-Property/Garbage-Recycling-Green-Can/Curbside-Collection",
    "https://www.cnv.org/Home-Property/Garbage-Recycling-Green-Can/Dog-Waste-Program",
    "https://www.cnv.org/Home-Property/Garbage-Recycling-Green-Can/Garbage",
    "https://www.cnv.org/Home-Property/Garbage-Recycling-Green-Can/Green-Can-Food-Scraps",
    "https://www.cnv.org/Home-Property/Garbage-Recycling-Green-Can/Multi-Family-Collection",
    "https://www.cnv.org/Home-Property/Garbage-Recycling-Green-Can/North-Shore-Recycling-and-Waste-Centre",
    "https://www.cnv.org/Home-Property/Garbage-Recycling-Green-Can/Recycling",
    "https://www.cnv.org/Home-Property/Garbage-Recycling-Green-Can/Wildlife-Awareness",
    "https://www.cnv.org/Home-Property/Local-Area-Service-Program",
    "https://www.cnv.org/Home-Property/Property-Taxes",
    "https://www.cnv.org/Home-Property/Property-Taxes/Annual-Tax-Sale-of-Property",
    "https://www.cnv.org/Home-Property/Property-Taxes/Preauthorized-Tax-Payment",
    "https://www.cnv.org/Home-Property/Safety",
    "https://www.cnv.org/Home-Property/Safety/Alcohol-in-Public-Spaces",
    "https://www.cnv.org/Home-Property/Safety/COVID-19",
    "https://www.cnv.org/Home-Property/Safety/Flood-Hazards",
    "https://www.cnv.org/Home-Property/Safety/NSEM",
    "https://www.cnv.org/Home-Property/Safety/RCMP",
    "https://www.cnv.org/Home-Property/Safety/RCMP/Additional-Resources",
    "https://www.cnv.org/Home-Property/Safety/RCMP/Community-Policing-Services",
    "https://www.cnv.org/Home-Property/Safety/RCMP/Crime-Prevention",
    "https://www.cnv.org/Home-Property/Safety/Slope-Stability",
    "https://www.cnv.org/Home-Property/Safety/Slope-Stability/Mosquito-Creek-Ravine-Assessment",
    "https://www.cnv.org/Home-Property/Utility-Rates",
    "https://www.cnv.org/Home-Property/Water-Sewer-Drainage",
    "https://www.cnv.org/Home-Property/Water-Sewer-Drainage/Drainage",
    "https://www.cnv.org/Home-Property/Water-Sewer-Drainage/Drainage/Erosion-and-Sediment-Control-Requirements",
    "https://www.cnv.org/Home-Property/Water-Sewer-Drainage/Drainage/Stormwater-Management-Plan-Requirements-for-New-Development",
    "https://www.cnv.org/Home-Property/Water-Sewer-Drainage/Drainage/Stormwater-Management-Plan-Requirements-for-New-Development/Unserviced-Properties",
    "https://www.cnv.org/Home-Property/Water-Sewer-Drainage/North-Shore-Wastewater-Treatment-Plant",
    "https://www.cnv.org/Home-Property/Water-Sewer-Drainage/Sewer",
    "https://www.cnv.org/Home-Property/Water-Sewer-Drainage/Water",
    "https://www.cnv.org/Parks-Recreation",
    "https://www.cnv.org/Parks-Recreation/Annual-Events",
    "https://www.cnv.org/Parks-Recreation/Annual-Events/Harbour-Beach",
    "https://www.cnv.org/Parks-Recreation/Annual-Events/Hot-Summer-Nights",
    "https://www.cnv.org/Parks-Recreation/Annual-Events/Long-Summer-Nights",
    "https://www.cnv.org/Parks-Recreation/Annual-Events/Lunchtime-Live",
    "https://www.cnv.org/Parks-Recreation/Annual-Events/Markets-in-the-City",
    "https://www.cnv.org/Parks-Recreation/Annual-Events/Outdoor-Movie-Nights",
    "https://www.cnv.org/Parks-Recreation/Annual-Events/Public-Works-Open-House",
    "https://www.cnv.org/Parks-Recreation/Annual-Events/Spirit-of-the-Season",
    "https://www.cnv.org/Parks-Recreation/Arts-Culture",
    "https://www.cnv.org/Parks-Recreation/Arts-Culture/Centennial-Theatre",
    "https://www.cnv.org/Parks-Recreation/Arts-Culture/Cultural-Plan",
    "https://www.cnv.org/Parks-Recreation/Arts-Culture/Museum-of-North-Vancouver",
    "https://www.cnv.org/Parks-Recreation/Arts-Culture/NVRC",
    "https://www.cnv.org/Parks-Recreation/Arts-Culture/Public-Art",
    "https://www.cnv.org/Parks-Recreation/Cemetery",
    "https://www.cnv.org/Parks-Recreation/Cemetery/Already-Interred",
    "https://www.cnv.org/Parks-Recreation/Cemetery/Planning",
    "https://www.cnv.org/Parks-Recreation/City-Library",
    "https://www.cnv.org/Parks-Recreation/Events",
    "https://www.cnv.org/Parks-Recreation/Events/Event-Booking-Guide",
    "https://www.cnv.org/Parks-Recreation/Events/Event-Booking-Guide/Event-Planning-Resources-and-Support",
    "https://www.cnv.org/Parks-Recreation/Events/Submit-Event",
    "https://www.cnv.org/Parks-Recreation/Parks-Greenways",
    "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Greenways",
    "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Greenways/Green-Necklace",
    "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Greenways/North-Shore-Spirit-Trail",
    "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Greenways/Ravine-Greenway-System",
    "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Greenways/Trans-Canada-Trail",
    "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Greenways/Upper-Levels-Greenway-System",
    "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Park-Projects",
    "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Park-Projects/1600-Eastern-Park",
    "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Park-Projects/CNV-Parks-and-Public-Space-Plan",
    "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Park-Projects/Dogs",
    "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Park-Projects/Eastview-Park",
    "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Park-Projects/Flight-PS752-Memorial",
    "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Park-Projects/Kings-Mill-Walk-Park-Master-Plan",
    "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Park-Projects/Past-Projects",
    "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Park-Projects/Past-Projects/Greenwood-Park-Kealy-Woods-Park",
    "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Park-Projects/Past-Projects/Park-Recreation-Shelters",
    "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Park-Projects/Past-Projects/St-Andrews-Park",
    "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Park-Projects/Past-Projects/Thain-Creek-Restoration",
    "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Park-Projects/Past-Projects/Topo-Park",
    "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Park-Projects/Ray-Perrault-Park-Expansion",
    "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Park-Projects/Tennis-Feasibility-Study",
    "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Parks",
    "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Parks/Park-Smart",
    "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Parks/Parks-Donation",
    "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Planning-Rules",
    "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Planning-Rules/Dogs",
    "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Planning-Rules/Parks-Master-Plan",
    "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Planning-Rules/Parks-and-Greenways-Strategic-Plan",
    "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Planning-Rules/Pesticide-Use-Control-Bylaw",
    "https://www.cnv.org/Parks-Recreation/Piers-Docks",
    "https://www.cnv.org/Parks-Recreation/Play-CNV",
    "https://www.cnv.org/Parks-Recreation/Play-CNV/Living-Lane",
    "https://www.cnv.org/Parks-Recreation/Play-CNV/Parklets",
    "https://www.cnv.org/Parks-Recreation/Play-CNV/Play-Boxes",
    "https://www.cnv.org/Parks-Recreation/Public-Spaces",
    "https://www.cnv.org/Parks-Recreation/Public-Spaces/Busking-in-the-City",
    "https://www.cnv.org/Parks-Recreation/Public-Spaces/Cates-Deck",
    "https://www.cnv.org/Parks-Recreation/Public-Spaces/Chalk-Art",
    "https://www.cnv.org/Parks-Recreation/Public-Spaces/Civic-Plaza",
    "https://www.cnv.org/Parks-Recreation/Public-Spaces/Lower-Lonsdale",
    "https://www.cnv.org/Parks-Recreation/Public-Spaces/Rogers-Plaza",
    "https://www.cnv.org/Parks-Recreation/Recreation",
    "https://www.cnv.org/Parks-Recreation/Recreation/Community-Recreation-Strategy",
    "https://www.cnv.org/Parks-Recreation/Recreation/Lawn-Bowling",
    "https://www.cnv.org/Parks-Recreation/Recreation/Skateboarding",
    "https://www.cnv.org/Parks-Recreation/Recreation/Sports-Fields",
    "https://www.cnv.org/Parks-Recreation/Recreation/Tennis-Pickleball",
    "https://www.cnv.org/Parks-Recreation/Recreation/Volleyball",
    "https://www.cnv.org/Parks-Recreation/The-Shipyards",
    "https://www.cnv.org/Parks-Recreation/The-Shipyards/About-The-Shipyards",
    "https://www.cnv.org/Parks-Recreation/The-Shipyards/Canada-Soccer-House-at-The-Shipyards",
    "https://www.cnv.org/Parks-Recreation/The-Shipyards/Shipbuilders'-Square",
    "https://www.cnv.org/Parks-Recreation/The-Shipyards/Shipyard-Commons",
    "https://www.cnv.org/Parks-Recreation/The-Shipyards/Skate-Plaza",
    "https://www.cnv.org/Parks-Recreation/The-Shipyards/Splash-Park",
    "https://www.cnv.org/Privacy-Policy",
    "https://www.cnv.org/RSS",
    "https://www.cnv.org/Search/Search-Help",
    "https://www.cnv.org/Site-Disclaimer",
    "https://www.cnv.org/Sitemap",
    "https://www.cnv.org/Social-Media-Terms",
    "https://www.cnv.org/Streets-Transportation",
    "https://www.cnv.org/Streets-Transportation/Mobility-Strategy",
    "https://www.cnv.org/Streets-Transportation/Parking",
    "https://www.cnv.org/Streets-Transportation/Parking/Accessible-Parking",
    "https://www.cnv.org/Streets-Transportation/Parking/Curb-Access-,-a-,amp;-Parking-Plan",
    "https://www.cnv.org/Streets-Transportation/Parking/Parking-Rules-and-Regulations",
    "https://www.cnv.org/Streets-Transportation/Parking/Pay-Parking",
    "https://www.cnv.org/Streets-Transportation/Parking/Resident-and-Visitor-Parking",
    "https://www.cnv.org/Streets-Transportation/Street-Use-Permits",
    "https://www.cnv.org/Streets-Transportation/Streets-Sidewalks",
    "https://www.cnv.org/Streets-Transportation/Streets-Sidewalks/Boulevards",
    "https://www.cnv.org/Streets-Transportation/Streets-Sidewalks/Boulevards/Boulevard-Planting",
    "https://www.cnv.org/Streets-Transportation/Streets-Sidewalks/Boulevards/Boulevard-Raised-Beds",
    "https://www.cnv.org/Streets-Transportation/Streets-Sidewalks/Boulevards/Landscape-Encroachments",
    "https://www.cnv.org/Streets-Transportation/Streets-Sidewalks/Roadwork",
    "https://www.cnv.org/Streets-Transportation/Streets-Sidewalks/Sidewalks",
    "https://www.cnv.org/Streets-Transportation/Streets-Sidewalks/Streetscape-Guidelines",
    "https://www.cnv.org/Streets-Transportation/Streets-Sidewalks/Temporary-Signs",
    "https://www.cnv.org/Streets-Transportation/Traffic",
    "https://www.cnv.org/Streets-Transportation/Traffic/Carsharing",
    "https://www.cnv.org/Streets-Transportation/Traffic/Electric-Vehicles",
    "https://www.cnv.org/Streets-Transportation/Traffic/Electric-Vehicles/Charging-Your-EV",
    "https://www.cnv.org/Streets-Transportation/Traffic/Electric-Vehicles/EV-Charging-Infrastructure-Requirements-for-New-Buildings",
    "https://www.cnv.org/Streets-Transportation/Traffic/Electric-Vehicles/EV-Charging-in-Existing-Buildings",
    "https://www.cnv.org/Streets-Transportation/Traffic/Electric-Vehicles/Electric-Vehicle-Strategy",
    "https://www.cnv.org/Streets-Transportation/Traffic/Electric-Vehicles/How-to-Use-the-Charging-Stations",
    "https://www.cnv.org/Streets-Transportation/Traffic/Electric-Vehicles/Incentive-Programs",
    "https://www.cnv.org/Streets-Transportation/Traffic/Ride-Hailing-,-a-,amp;-Taxis",
    "https://www.cnv.org/Streets-Transportation/Traffic/Ride-Sharing",
    "https://www.cnv.org/Streets-Transportation/Traffic/Traffic-Calming",
    "https://www.cnv.org/Streets-Transportation/Traffic/Traffic-Signals",
    "https://www.cnv.org/Streets-Transportation/Traffic/Trucks",
    "https://www.cnv.org/Streets-Transportation/Transportation-Planning",
    "https://www.cnv.org/Streets-Transportation/Transportation-Planning/Accessibility",
    "https://www.cnv.org/Streets-Transportation/Transportation-Planning/Mobility-Network",
    "https://www.cnv.org/Streets-Transportation/Transportation-Planning/North-Shore-Connects",
    "https://www.cnv.org/Streets-Transportation/Transportation-Planning/North-Shore-Transit-Plan",
    "https://www.cnv.org/Streets-Transportation/Transportation-Planning/North-Shore-Transportation-Survey",
    "https://www.cnv.org/Streets-Transportation/Transportation-Planning/Safe-Mobility-Strategy",
    "https://www.cnv.org/Streets-Transportation/Transportation-Planning/Walk-CNV",
    "https://www.cnv.org/Streets-Transportation/Transportation-Projects",
    "https://www.cnv.org/Streets-Transportation/Transportation-Projects/Cloverley-Elementary-Transportation-Infrastructure-Improvements",
    "https://www.cnv.org/Streets-Transportation/Transportation-Projects/Crosscut-Bridge",
    "https://www.cnv.org/Streets-Transportation/Transportation-Projects/Eastside-Connector",
    "https://www.cnv.org/Streets-Transportation/Transportation-Projects/Past-Projects",
    "https://www.cnv.org/Streets-Transportation/Transportation-Projects/Past-Projects/1st-Street-Mobility-Corridor",
    "https://www.cnv.org/Streets-Transportation/Transportation-Projects/Past-Projects/Cloverley",
    "https://www.cnv.org/Streets-Transportation/Transportation-Projects/Past-Projects/E-29th-Street-Corridor-Study",
    "https://www.cnv.org/Streets-Transportation/Transportation-Projects/Past-Projects/Esplanade-Complete-Street",
    "https://www.cnv.org/Streets-Transportation/Transportation-Projects/Past-Projects/Grand-Boulevard-Active-Mobility-Options",
    "https://www.cnv.org/Streets-Transportation/Transportation-Projects/Past-Projects/Low-Level-Road-Project",
    "https://www.cnv.org/Streets-Transportation/Transportation-Projects/Past-Projects/Marine-Main-R2-RapidBus-Upgrades",
    "https://www.cnv.org/Streets-Transportation/Transportation-Projects/Past-Projects/Mosquito-Creek-Bridge-Replacement",
    "https://www.cnv.org/Streets-Transportation/Transportation-Projects/Past-Projects/Ridgeway-School-Zone-Safety-Review",
    "https://www.cnv.org/Streets-Transportation/Transportation-Projects/Past-Projects/St-Andrews-Safety-Improvements",
    "https://www.cnv.org/Streets-Transportation/Transportation-Projects/Past-Projects/Waterfront-Transportation-Network-Study",
    "https://www.cnv.org/Streets-Transportation/Travel-Options",
    "https://www.cnv.org/Streets-Transportation/Travel-Options/Cycling",
    "https://www.cnv.org/Streets-Transportation/Travel-Options/Cycling/AAA-Bicycle-Network",
    "https://www.cnv.org/Streets-Transportation/Travel-Options/Cycling/Bicycle-Master-Plan",
    "https://www.cnv.org/Streets-Transportation/Travel-Options/Cycling/Bikeway-Types",
    "https://www.cnv.org/Streets-Transportation/Travel-Options/Cycling/Cycling-Safety-Tips",
    "https://www.cnv.org/Streets-Transportation/Travel-Options/Cycling/Go-by-Bike-Week",
    "https://www.cnv.org/Streets-Transportation/Travel-Options/E-Bike-Share-Program",
    "https://www.cnv.org/Streets-Transportation/Travel-Options/E-Cargo-Bikes",
    "https://www.cnv.org/Streets-Transportation/Travel-Options/GoCNV",
    "https://www.cnv.org/Streets-Transportation/Travel-Options/Look-Think-Go",
    "https://www.cnv.org/Streets-Transportation/Travel-Options/Look-Think-Go/Elephant-s-Feet",
    "https://www.cnv.org/Streets-Transportation/Travel-Options/Look-Think-Go/Road-Markings-and-Signs",
    "https://www.cnv.org/Streets-Transportation/Travel-Options/Look-Think-Go/Videos",
    "https://www.cnv.org/Streets-Transportation/Travel-Options/Safe-and-Active-School-Travel-Program",
    "https://www.cnv.org/Streets-Transportation/Travel-Options/Safe-and-Active-School-Travel-Program/Best-Route-Maps-,-a-,amp;-School-Travel-Plans",
    "https://www.cnv.org/Streets-Transportation/Travel-Options/Safe-and-Active-School-Travel-Program/Safe-and-Active-School-Travel-Program-Mini-Grants",
    "https://www.cnv.org/Streets-Transportation/Travel-Options/Transit",
    "https://www.cnv.org/Streets-Transportation/Travel-Options/Walking",
    "https://www.cnv.org/Streets-Transportation/Travel-Options/eScooters",
    "https://www.cnv.org/Training-Heavy-Rainfall",
    "https://www.cnv.org/google-translate-disclaimer"
  ],
  "description": "Standard inner page: hero banner image, breadcrumb, left section navigation sidebar and a main content column with heading, text, tables, cards or notices",
  "blocks": [
    {
      "name": "breadcrumb",
      "instances": [
        "#breadcrumbs-navigation"
      ],
      "pageInstances": {
        "https://www.cnv.org/Business-Development": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Bid-Notices": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Bid-Notices/Fair-Wage-Policy": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Bid-Notices/Sustainable-Purchasing-Policy": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Development-Cost-Charges": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Energy-Efficient-Buildings-Initiative": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Energy-Efficient-Buildings-Initiative/New-Buildings": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1036-Grand-Boulevard": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/114-118-and-122-132-West-15th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/115-East-18th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/115-East-1st-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/115-East-Keith-Road": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/115-West-Esplanade-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/119-East-2nd-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/120-East-14th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1220-St-Georges": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1225-East-Keith-Road": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/124-W-20th-St": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/125-145-East-13th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/125-East-20th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/125-Victory-Ship-Way": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/127-129-East-12th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1311-Lonsdale-Avenue": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/133-East-4th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1357-Jones-Avenue": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/140-West-19th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1421-Fell-Avenue": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/144-West-21st-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1441-St-Georges-Avenue": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/145-153-East-4th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/146-160-East-2nd-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/149-West-3rd-Street-old": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/150-East-8th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/151-East-Keith-Road": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1536-1550-Eastern-Avenue": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/154-East-17th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1540-Georges-Ave-and-215-235-East-16th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1540-Georges-Avenue-and-215-235-East-16th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1540-St-Georges": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1553-Sutherland-Avenue": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1612-St-Georges-Avenue": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2000-Wolfe-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2008-Westview": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2024-Mackay-Avenue": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2045-Fell-Avenue": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/205-St,-d-,-Patricks-Avenue": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/210-230-E-2nd-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2121-2129-2137-Chesterfield-Avenue": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/213-E-22nd-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/214-East-Esplanade": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/215-West-Keith-Road": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/216-East-3rd-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2212-St-Georges-Avenue": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/222-East-2nd-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/226-West-5th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/229-231-West-15th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/229-East-22nd-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/233-E-22nd-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/234-East-25th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/236-254-East-3rd-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2416-Western-Avenue": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/245-East-10th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/245-West-27th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/250-East-15th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2525-Lonsdale-Avenue": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/253-East-28th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2540-2590-Lonsdale-Avenue": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/259-East-23rd-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/259-West-Keith-Road": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/261-263-West-6th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2612-Lonsdale-Avenue": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/266-East-1st-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/273-279-E-6th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/275-East-2nd-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2762-Lonsdale-Avenue": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/309-311-West-1st-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/309-Kennard-Avenue": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/311-Moody-Avenue": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/311-West-14th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/317-West-20th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/321-West-4th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/322-West-14th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/328-East-14th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/328-West-14th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/332-East-24th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/332-West-16th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/333-West-20th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/341-347-West-4th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/341-West-24th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/350-East-2nd-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/351-West-3rd-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/352-West-15th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/357-East-22nd-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/364-East-14th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/365-East-22nd-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/365-West-19th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/380-East-1st-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/400-East-1st-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/402-438-East-3rd-St-and-341-343-St-Davids-Ave": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/407-West-16th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/412-East-11th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/412-East-5th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/417-West-14th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/422-East-1st-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/427-429-and-433-435-E-3rd-St": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/429-East-15th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/442-444-East-1st-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/442-East-16th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/450-West-15th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/452-East-1st-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/453-West-24th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/457-West-14th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/462-East-11th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/464-West-28th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/467-East-2nd-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/502-East-3rd-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/502-East-5th": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/509-East-6th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/528-East-7th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/540-West-21st-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/541-West-Keith-Road": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/548-558-East-1st-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/602-East-2nd": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/618-East-4th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/63-Mahon-Avenue": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/630-Brooksbank-Avenue": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/639-East-4th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/642-East-6th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/645-Mahon-Avenue": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/646-East-4th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/648-West-14th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/651-East-1st-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/652-East-4th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/705-717-West-15th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/720-Copping-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/758-762-East-3rd-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/758-Harbourside-Drive": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/758-Harbourside-Drive-Temporary-Use-Permit": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/800-Marine-Drive": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/818-858-West-15th-St": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/822-E-4th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/833-Automall-Drive": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/835---845-West-15th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/842-East-5th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/844-East-6th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/864-East-14th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/880-West-15th-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/905-Ridgeway-Avenue": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/935-Marine-Drive": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/971-West-1st-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Development-Permits": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Development-Permits/Streamside-Development-Permit-Areas": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Planning-Application-Resources": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Planning-Application-Resources/Public-Works-and-Engineering-Servicing-Standards": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Planning-Applications": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Planning-Applications/Official-Community-Plan-Amendment-Application-Process": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Zoning": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Leadership-in-Energy-and-Environmental-Design": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Building/Subdivisions": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Business-Licences": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Business-Licences/Applying-for-a-Business-Licence": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Business-Licences/BizPaL": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Business-Licences/Business-Licence-Bylaws": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Business-Licences/Food-Trucks": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Business-Licences/Inter-Municipal-Business-Licence": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Business-Licences/Monthly-Update-of-New-Businesses": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Business-Licences/Outdoor-Dining": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Business-Licences/Recreational-Cannabis-Retail": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Business-Licences/Short-Term-Rentals": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Economic-Development": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Economic-Development/Business-Improvement-Area": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Economic-Development/Business-Opportunities": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Economic-Development/Economic-Strategy": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Economic-Development/Invest": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Economic-Development/Invest/Competitive-Advantages": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Economic-Development/Invest/Resources-and-Support": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Economic-Development/Small-Business": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Filming-In-the-City": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Filming-In-the-City/Benefits-of-Filming": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Filming-In-the-City/Film-Bursary": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Filming-In-the-City/Film-Productions-in-the-City": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Filming-In-the-City/Filming-Checklist": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Filming-In-the-City/Filming-Locations": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Filming-In-the-City/Filming-Locations/Cemetery-Filming": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Filming-In-the-City/Filming-Locations/Filming-at-The-Shipyards": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Filming-In-the-City/Filming-Locations/Filming-in-City-Hall": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Filming-In-the-City/Filming-Locations/Your-Property-as-a-Film-Location": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Filming-In-the-City/Student-Filming": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Heritage": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Heritage/Heritage-Awards": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Lonsdale-Energy": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Permits-Inspections": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Permits-Inspections/Building-Permit-Statistical-Reports": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Permits-Inspections/Building-Permits": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Permits-Inspections/Building-Permits/Alternative-Solutions": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Permits-Inspections/Building-Permits/Commercial-Tenant-Improvement": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Permits-Inspections/Building-Permits/Demolition-Permits": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Permits-Inspections/Building-Permits/General-Building-Permit-Info": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Permits-Inspections/Building-Permits/Ground-Oriented-Housing": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Permits-Inspections/Building-Permits/How-to-Submit-Construction-Permits": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Permits-Inspections/Building-Permits/New-Coach-House": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Permits-Inspections/Building-Permits/New-Complex-Buildings": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Permits-Inspections/Building-Permits/New-Garages-Carports": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Permits-Inspections/Building-Permits/New-Single-and-Two-Family-Dwellings": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Permits-Inspections/Building-Permits/Residential-Renovation-Additions-Non-Strata": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Permits-Inspections/Building-Permits/Residential-Renovations-Strata": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Permits-Inspections/Building-Permits/Secondary-Suites": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Permits-Inspections/Building-Permits/Swimming-Pools": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Permits-Inspections/Electrical-Permit-Application-Forms-and-Information": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Permits-Inspections/Inspections": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Permits-Inspections/Plumbing-and-Gas-Permit-Application-Forms-and-Information": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Permits-Inspections/Sign-Permit-Application-Forms-and-Information": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Business-Development/Wireless-Communication": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Calendar-of-Events": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/Awards": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/Harbour-Deck": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/Harbourside-Waterfront-Development-Application": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/Harry-Jerome-Community-Recreation-Centre": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/Harry-Jerome-Community-Recreation-Centre/About-the-Centre": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/Harry-Jerome-Community-Recreation-Centre/Construction": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/Harry-Jerome-Community-Recreation-Centre/Explore-the-Project": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/Harry-Jerome-Community-Recreation-Centre/Explore-the-Project/Key-Reports-to-Date": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/Harry-Jerome-Community-Recreation-Centre/News-and-Updates": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/Harry-Jerome-Community-Recreation-Centre/Opening-Celebration": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/Harry-Jerome-Neighbourhood-Lands": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/North-Shore-Neighbourhood-House-Site-Redevelopment": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/Past-Projects": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/Past-Projects/City-Operations-Centre-Redevelopment": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/Past-Projects/Civic-Centre-Redevelopment": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/Past-Projects/Duplex-Special-Study": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/Past-Projects/Flicka-Gymnastics": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/Past-Projects/Lonsdale-Great-Street-Project": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/Past-Projects/Mahon-Park-Childcare-Centre-Fieldhouse": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/Past-Projects/Moodyville-Development-Controls-Process": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/Past-Projects/Silver-Harbour": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/Past-Projects/The-Shipyards-Destination-Infrastructure-Project": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/TransLink-Moodyville-Development": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/Community-Statistics": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/Departments": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/Departments/Chief-Administrative-Officer": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/Departments/City-Clerks": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/Departments/Communications": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/Departments/Engineering-Parks-and-Environment": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/Departments/Finance": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/Departments/People-and-Culture": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/Departments/Planning-and-Development": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/Departments/Public-Safety": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/How-City-Hall-Works": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/Maps": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/Maps/Map-Catalogue": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/New-Families-and-Residents": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/About/Sister-Cities": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Bylaws": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Bylaws/Animal-Control": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Bylaws/Bylaw-Adjudication": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Bylaws/Bylaw-Complaints": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Bylaws/Bylaw-Enforcement": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Bylaws/Bylaw-Enforcement/Graffiti": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Bylaws/Bylaw-Enforcement/Smoking-Bylaw": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Bylaws/Noise-Control": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Careers": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Careers/Living-Wage": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Claims-and-Causes-of-Loss": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Claims-and-Causes-of-Loss/Causes-of-Loss": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Claims-and-Causes-of-Loss/Claims": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Committees": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Committees/Advisory-Design-Panel": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Committees/Advisory-Design-Panel/ADP-Agenda": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Committees/Advisory-Design-Panel/ADP-Minutes": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Committees/Advisory-Planning-Commission": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Committees/Advisory-Planning-Commission/APC-Agenda": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Committees/Advisory-Planning-Commission/APC-Minutes": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Committees/Board-of-Variance": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Committees/Board-of-Variance/Board-of-Variance-Agendas": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Committees/Board-of-Variance/Board-of-Variance-Meeting-Minutes": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Committees/Community-Safety-Advisory-Committee": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Committees/Community-Safety-Advisory-Committee/CSAC-Agenda": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Committees/Community-Safety-Advisory-Committee/CSAC-Minute": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Committees/Current-Vacancies-Committees-Commissions-and-Boards": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Committees/Heritage-Advisory-Committee": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Committees/Heritage-Advisory-Committee/Heritage-Advisory-Commission-Meeting-Minutes": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Committees/Heritage-Advisory-Committee/Heritage-Advisory-Committee-Agendas": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Committees/Integrated-Transportation-Committee": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Committees/Integrated-Transportation-Committee/Integrated-Transportation-Committee-Agendas": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Committees/Integrated-Transportation-Committee/Integrated-Transportation-Committee-Meeting-Minutes": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Committees/North-Shore-Accessibility-Advisory-Committee": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Committees/North-Vancouver-City-Library-Board": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Committees/North-Vancouver-Museum-and-Archives-Commission": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Committees/North-Vancouver-Policing-Committee": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Committees/North-Vancouver-Public-Art-Advisory-Committee": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Committees/North-Vancouver-Recreation-and-Culture-Commission": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Committees/Social-Planning-Advisory-Committee": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Committees/Social-Planning-Advisory-Committee/Social-Planning-Advisory-Committee-Agendas": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Committees/Social-Planning-Advisory-Committee/Social-Planning-Advisory-Committee-Meeting-Minutes": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Community-Engagement": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Community-Engagement/Informed": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Contact": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Contact/Complaints": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Contact/Respectful-Communication-Policy": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Contact/Social-Media": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2012-Meetings": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2012-Meetings/Council-Videos": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2013-Meetings": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2013-Meetings/Council-Videos": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2014-Meetings": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2014-Meetings/Council-Videos": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2015-Meetings": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2015-Meetings/Council-Videos": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2016-Meetings": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2016-Meetings/Council-Videos": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2017-Meetings": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2017-Meetings/Council-Videos": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2018-Meetings": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2018-Meetings/Council-Videos": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2019-Meetings": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2019-Meetings/Council-Videos": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2020-Meetings": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2020-Meetings/Council-Videos": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2021-Meetings": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2021-Meetings/Council-Videos": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2022-Meetings": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2022-Meetings/Council-Videos": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2023-Meetings": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2023-Meetings/Council-Videos": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2024-Meetings": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2024-Meetings/Council-Videos": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2025-Meetings": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2025-Meetings/Council-Videos": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2026-Meetings": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2026-Meetings/Council-Videos": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Meeting-Live-Streaming": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Minutes-Archive": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Proclamations": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Videos": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Videos/2003-Council-Videos": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Videos/2004-Council-Videos": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Videos/2005-Council-Videos": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Videos/2006-Council-Videos": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Videos/2007-Council-Videos": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Videos/2008-Council-Videos": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Videos/2009-Council-Videos": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Videos/2010-Council-Videos": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Videos/2011-Council-Videos": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Delegation-Process": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Public-Hearings-and-Public-Meetings/Finance-Committee-Minutes": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Public-Hearings-and-Public-Meetings/Policy-Committee-Minutes": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Public-Hearings-and-Public-Meetings/Public-Hearing-Minutes": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Public-Hearings-and-Public-Meetings/Public-Meeting-Minutes": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Public-Hearings-and-Public-Meetings/Upcoming-Public-Hearings-and-Meetings": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Public-Input-Period": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Public-Notices": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Report-of-Committee-of-the-Whole": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Finances": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Finances/Annual-Municipal-Report": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Finances/Financial-Plan": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Finances/Financial-Statements": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/General-Local-Election": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/General-Local-Election/2026-General-Local-Election": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/General-Local-Election/Past-Election-Results": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Mayor-Council": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Mayor-Council/Council-Code-of-Conduct": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Mayor-Council/Council-Strategic-Plan": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Mayor-Council/Councillor-Angela-Girard": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Mayor-Council/Councillor-Don-Bell": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Mayor-Council/Councillor-Holly-Back": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Mayor-Council/Councillor-Shervin-Shahriari": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Mayor-Council/Councillor-Tony-Valente": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Mayor-Council/Mayor-Linda-Buchanan": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Mayor-Council/Mayor-Linda-Buchanan/Community-Updates": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/News-Room": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/News-Room/CityConnect-Subscription": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/News-Room/CityView-eNewsletter": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/News-Room/CityView-eNewsletter-Subscribe": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/News-Room/News-Releases": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/News-Room/News-Releases/2021/8/24/Shipyards-Receives-Top-Honours": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/News-Room/News-Releases/2025/9/23/Nomad-Coffee-Selected-as-Caf%C3%A9-Operator-for-Future-Harry-Jerome-Community-Recreation-Centre": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/News-Room/News-Releases/2026/10/21/Official-results-announced-for-the-2026-General-Local-Election--for-the-City-of-North-Vancouver": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/News-Room/News-Releases/2026/3/4/New-Harry-Jerome-Community-Recreation-Centre-to-Open-July-2026": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/News-Room/News-Releases/2026/3/5/Joint-Statement-from-Mayor-Linda-Buchanan,-CNV-and-Mayor-Mike-Little,-DNV": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/News-Room/News-Releases/2026/6/23/Former-Mickey-MacDougall-Recreation-Centre-Reopens-Today-Following-Major-Energy-Upgrades": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/News-Room/News-Releases/2026/6/3/New-HJCRC-and-Silver-Harbour-Seniors%E2%80%99-Activity-Centre-to-Open-July-25,-2026": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/News-Room/News-Releases/2026/7/10/Joint-Statement-from-CNV-Mayor-Linda-Buchanan-and-DNV-Mayor-Mike-Little": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/News-Room/News-Releases/2026/7/23/Maclean%E2%80%99s-Magazine-Highlights-Lower-Lonsdale-As-One-of-the-Coolest-Neighbourhoods-in-Canada": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/News-Room/News-Releases/2026/7/25/City-of-North-Vancouver-opens-New-Harry-Jerome-Community-Recreation-Centre-Today": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/News-Room/News-Releases/2026/8/20/City-of-North-Vancouver-opens-new-Crosscut-Bridge-today": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/News-Room/Whats-New": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/News-Room/Whats-New/2022/4/1/New-Harry-Jerome-Community-Recreation-Centre-is-Underway": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/News-Room/Whats-New/2022/8/18/Federal-Funding-to-Retrofit-Mickey-McDougall-Community-Recreation-Centre": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/News-Room/Whats-New/2026/10/26/Volunteer-for-a-Committee-and-Help-Shape-Your-Community": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/News-Room/Whats-New/2026/11/3/Remembrance-Day-in-the-City": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/News-Room/Whats-New/2026/11/5/Get-Ready-for-Winter-at-The-Shipyards": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/News-Room/Whats-New/2026/8/28/Potential-service-impacts-for-building-permits-and-inspections": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Official-Community-Plan": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Online-Services": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Online-Services/CityCollect": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Online-Services/CityFix": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Online-Services/CityServe": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Online-Services/Dog-Licences": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Online-Services/Gateway": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Truth-and-Reconciliation": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Comments": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Climate-Action": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Climate-Action/Carbon-Fund": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Climate-Action/Climate-Change-Adaptation": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Climate-Action/Climate-Change-Adaptation/Building-Adaptive-and-Resilient-Communities-Program": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Climate-Action/Climate-Environment-Strategy": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Climate-Action/Climate-Targets": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Climate-Action/Corporate-Climate-Action": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Climate-Action/Street-Tree-Planting-Program": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Energy": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Energy/Jump-on-a-New-Heat-Pump-New": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Environmental-Protection": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Environmental-Protection/Air-Quality": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Environmental-Protection/Invasive-Species": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Environmental-Protection/Invasive-Species/Chafer-Beetle": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Environmental-Protection/Invasive-Species/European-Fire-Ant": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Environmental-Protection/Invasive-Species/Invasive-Plants": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Environmental-Protection/Rain-Drains-Creeks": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Environmental-Protection/Rain-Drains-Creeks/ISMP-Planning-101": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Environmental-Protection/Rain-Drains-Creeks/Stormwater-Management-Overview": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Environmental-Protection/Rain-Drains-Creeks/Watersheds-101": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Environmental-Protection/Spill-Response": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Environmental-Protection/Waste": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Environmental-Protection/Waste/Cigarette-Waste": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Environmental-Protection/Waste/On-Street-Recycling": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Environmental-Protection/Waste/Poo-Fairy": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Environmental-Protection/Water-Conservation": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Environmental-Protection/Water-Conservation/Sprinkling-Regulations": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Grants-Funding": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Grants-Funding/Child-Care-Capital-Improvement-Fund": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Grants-Funding/Children-and-Youth-Grants": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Grants-Funding/Community-Grants": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Grants-Funding/Culture-Makes-The-City-Grants": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Grants-Funding/Housing-Initiatives-Grant": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Grants-Funding/Special-Events-and-Festivals-Funding": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Grants-Funding/Supportive-Funding-Review": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Grants-Funding/Violence-Prevention-in-Schools-Grant": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Help-Environment": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Help-Environment/City-Park-Stewards": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Help-Environment/Community-Cleanup": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Help-Environment/Earth-Day": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Help-Environment/Earth-Hour": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Help-Environment/Rivers-Day": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Help-Environment/Sustainable-Holidays": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Housing": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Housing/Active-Design": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Housing/Adaptable-Design": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Housing/Affordable-Housing": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Housing/Family-Friendly-Housing": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Housing/Homelessness": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Housing/Housing-Accelerator-Fund": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Housing/Housing-Action-Plan": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Housing/Housing-Needs-Report": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Housing/Housing-Target-Report": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Housing/Provincial-Housing-Legislation-Updates": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Housing/Provincial-Housing-Legislation-Updates/Bill-25,-c-,-Response-to-provincial-requirements": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Housing/Provincial-Housing-Legislation-Updates/City-Lands-Planning": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Housing/Provincial-Housing-Legislation-Updates/Growing-Livable-Neighbourhoods": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Housing/Provincial-Housing-Legislation-Updates/Small-Scale-Housing-Changes": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Housing/Rental-Housing": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Housing/Tenant-Resources": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Land-Use": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Land-Use/Commercial": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Land-Use/Density-Bonusing": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Land-Use/Industrial": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Land-Use/Institutional": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Land-Use/Residential": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Living-City": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Living-City/Living-City-Awards": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Living-City/Living-City-Grant": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Open-Streets": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Accessibility": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Child-Care": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Children-Youth-Families": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Community-Agencies": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Community-Agencies/Lions-Gate-Hospital": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Community-Wellbeing": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Community-Wellbeing/Social-Plan": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Complete-Communities-Assessment": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Cultural-Diversity": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Local-Food": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Local-Food/Community-Gardens": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Local-Food/Hobby-Bee-Keeping": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Local-Food/Loutet-Farm": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Local-Food/Pollinators": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Local-Food/Urban-Chicken-Keeping": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Poverty-Reduction-Strategy": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Seniors": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Youth": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Youth/CNV4ME": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Youth/CNV4ME/How-Our-City-Works": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Youth/CNV4ME/Kid-City": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Youth/CNV4ME/School-the-City": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Youth/Studio-in-the-City": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Youth/Youth-Awards-Scholarships": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Youth/Youth-Awards-Scholarships/Civic-Youth-Awards": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Youth/Youth-Awards-Scholarships/Youth-Centennial-Scholarship": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Youth/Youth-Week": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Trees": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Trees/Private-Trees": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Trees/Public-Trees": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Trees/Tree-Care": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Community-Environment/Trees/Urban-Forest": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Emergency-Preparedness": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Emergency-Preparedness/Extreme-Cold": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Emergency-Preparedness/Extreme-Heat": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Emergency-Preparedness/Heavy-Rainfall": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Emergency-Preparedness/Snowfall": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Emergency-Preparedness/Storms": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Fire-Department": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Fire-Department/Commercial-Events": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Fire-Department/Fire-Danger-Rating": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Fire-Department/Fire-Safety-Prevention": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Fire-Department/Fire-Safety-Prevention/Halloween": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Fire-Department/Fire-Safety-Prevention/Holiday-Safety": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Fire-Department/FireSmart": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Fire-Department/Public-Education": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Garbage-Recycling-Green-Can": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Garbage-Recycling-Green-Can/Curbside-Collection": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Garbage-Recycling-Green-Can/Dog-Waste-Program": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Garbage-Recycling-Green-Can/Garbage": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Garbage-Recycling-Green-Can/Green-Can-Food-Scraps": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Garbage-Recycling-Green-Can/Multi-Family-Collection": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Garbage-Recycling-Green-Can/North-Shore-Recycling-and-Waste-Centre": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Garbage-Recycling-Green-Can/Recycling": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Garbage-Recycling-Green-Can/Wildlife-Awareness": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Local-Area-Service-Program": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Property-Taxes": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Property-Taxes/Annual-Tax-Sale-of-Property": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Property-Taxes/Preauthorized-Tax-Payment": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Safety": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Safety/Alcohol-in-Public-Spaces": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Safety/COVID-19": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Safety/Flood-Hazards": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Safety/NSEM": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Safety/RCMP": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Safety/RCMP/Additional-Resources": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Safety/RCMP/Community-Policing-Services": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Safety/RCMP/Crime-Prevention": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Safety/Slope-Stability": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Safety/Slope-Stability/Mosquito-Creek-Ravine-Assessment": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Utility-Rates": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Water-Sewer-Drainage": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Water-Sewer-Drainage/Drainage": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Water-Sewer-Drainage/Drainage/Erosion-and-Sediment-Control-Requirements": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Water-Sewer-Drainage/Drainage/Stormwater-Management-Plan-Requirements-for-New-Development": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Water-Sewer-Drainage/Drainage/Stormwater-Management-Plan-Requirements-for-New-Development/Unserviced-Properties": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Water-Sewer-Drainage/North-Shore-Wastewater-Treatment-Plant": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Water-Sewer-Drainage/Sewer": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Water-Sewer-Drainage/Water": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Annual-Events": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Annual-Events/Harbour-Beach": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Annual-Events/Hot-Summer-Nights": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Annual-Events/Long-Summer-Nights": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Annual-Events/Lunchtime-Live": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Annual-Events/Markets-in-the-City": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Annual-Events/Outdoor-Movie-Nights": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Annual-Events/Public-Works-Open-House": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Annual-Events/Spirit-of-the-Season": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Arts-Culture": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Arts-Culture/Centennial-Theatre": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Arts-Culture/Cultural-Plan": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Arts-Culture/Museum-of-North-Vancouver": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Arts-Culture/NVRC": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Arts-Culture/Public-Art": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Cemetery": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Cemetery/Already-Interred": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Cemetery/Planning": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/City-Library": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Events": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Events/Event-Booking-Guide": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Events/Event-Booking-Guide/Event-Planning-Resources-and-Support": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Events/Submit-Event": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Greenways": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Greenways/Green-Necklace": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Greenways/North-Shore-Spirit-Trail": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Greenways/Ravine-Greenway-System": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Greenways/Trans-Canada-Trail": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Greenways/Upper-Levels-Greenway-System": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Park-Projects": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Park-Projects/1600-Eastern-Park": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Park-Projects/CNV-Parks-and-Public-Space-Plan": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Park-Projects/Dogs": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Park-Projects/Eastview-Park": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Park-Projects/Flight-PS752-Memorial": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Park-Projects/Kings-Mill-Walk-Park-Master-Plan": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Park-Projects/Past-Projects": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Park-Projects/Past-Projects/Greenwood-Park-Kealy-Woods-Park": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Park-Projects/Past-Projects/Park-Recreation-Shelters": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Park-Projects/Past-Projects/St-Andrews-Park": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Park-Projects/Past-Projects/Thain-Creek-Restoration": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Park-Projects/Past-Projects/Topo-Park": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Park-Projects/Ray-Perrault-Park-Expansion": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Park-Projects/Tennis-Feasibility-Study": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Parks": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Parks/Park-Smart": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Parks/Parks-Donation": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Planning-Rules": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Planning-Rules/Dogs": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Planning-Rules/Parks-Master-Plan": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Planning-Rules/Parks-and-Greenways-Strategic-Plan": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Planning-Rules/Pesticide-Use-Control-Bylaw": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Piers-Docks": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Play-CNV": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Play-CNV/Living-Lane": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Play-CNV/Parklets": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Play-CNV/Play-Boxes": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Public-Spaces": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Public-Spaces/Busking-in-the-City": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Public-Spaces/Cates-Deck": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Public-Spaces/Chalk-Art": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Public-Spaces/Civic-Plaza": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Public-Spaces/Lower-Lonsdale": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Public-Spaces/Rogers-Plaza": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Recreation": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Recreation/Community-Recreation-Strategy": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Recreation/Lawn-Bowling": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Recreation/Skateboarding": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Recreation/Sports-Fields": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Recreation/Tennis-Pickleball": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Recreation/Volleyball": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/The-Shipyards": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/The-Shipyards/About-The-Shipyards": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/The-Shipyards/Canada-Soccer-House-at-The-Shipyards": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/The-Shipyards/Shipbuilders'-Square": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/The-Shipyards/Shipyard-Commons": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/The-Shipyards/Skate-Plaza": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/The-Shipyards/Splash-Park": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Privacy-Policy": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/RSS": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Search/Search-Help": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Site-Disclaimer": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Sitemap": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Social-Media-Terms": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Mobility-Strategy": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Parking": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Parking/Accessible-Parking": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Parking/Curb-Access-,-a-,amp;-Parking-Plan": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Parking/Parking-Rules-and-Regulations": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Parking/Pay-Parking": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Parking/Resident-and-Visitor-Parking": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Street-Use-Permits": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Streets-Sidewalks": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Streets-Sidewalks/Boulevards": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Streets-Sidewalks/Boulevards/Boulevard-Planting": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Streets-Sidewalks/Boulevards/Boulevard-Raised-Beds": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Streets-Sidewalks/Boulevards/Landscape-Encroachments": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Streets-Sidewalks/Roadwork": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Streets-Sidewalks/Sidewalks": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Streets-Sidewalks/Streetscape-Guidelines": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Streets-Sidewalks/Temporary-Signs": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Traffic": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Traffic/Carsharing": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Traffic/Electric-Vehicles": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Traffic/Electric-Vehicles/Charging-Your-EV": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Traffic/Electric-Vehicles/EV-Charging-Infrastructure-Requirements-for-New-Buildings": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Traffic/Electric-Vehicles/EV-Charging-in-Existing-Buildings": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Traffic/Electric-Vehicles/Electric-Vehicle-Strategy": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Traffic/Electric-Vehicles/How-to-Use-the-Charging-Stations": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Traffic/Electric-Vehicles/Incentive-Programs": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Traffic/Ride-Hailing-,-a-,amp;-Taxis": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Traffic/Ride-Sharing": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Traffic/Traffic-Calming": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Traffic/Traffic-Signals": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Traffic/Trucks": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Transportation-Planning": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Transportation-Planning/Accessibility": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Transportation-Planning/Mobility-Network": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Transportation-Planning/North-Shore-Connects": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Transportation-Planning/North-Shore-Transit-Plan": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Transportation-Planning/North-Shore-Transportation-Survey": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Transportation-Planning/Safe-Mobility-Strategy": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Transportation-Planning/Walk-CNV": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Transportation-Projects": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Transportation-Projects/Cloverley-Elementary-Transportation-Infrastructure-Improvements": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Transportation-Projects/Crosscut-Bridge": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Transportation-Projects/Eastside-Connector": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Transportation-Projects/Past-Projects": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Transportation-Projects/Past-Projects/1st-Street-Mobility-Corridor": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Transportation-Projects/Past-Projects/Cloverley": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Transportation-Projects/Past-Projects/E-29th-Street-Corridor-Study": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Transportation-Projects/Past-Projects/Esplanade-Complete-Street": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Transportation-Projects/Past-Projects/Grand-Boulevard-Active-Mobility-Options": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Transportation-Projects/Past-Projects/Low-Level-Road-Project": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Transportation-Projects/Past-Projects/Marine-Main-R2-RapidBus-Upgrades": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Transportation-Projects/Past-Projects/Mosquito-Creek-Bridge-Replacement": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Transportation-Projects/Past-Projects/Ridgeway-School-Zone-Safety-Review": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Transportation-Projects/Past-Projects/St-Andrews-Safety-Improvements": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Transportation-Projects/Past-Projects/Waterfront-Transportation-Network-Study": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Travel-Options": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Travel-Options/Cycling": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Travel-Options/Cycling/AAA-Bicycle-Network": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Travel-Options/Cycling/Bicycle-Master-Plan": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Travel-Options/Cycling/Bikeway-Types": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Travel-Options/Cycling/Cycling-Safety-Tips": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Travel-Options/Cycling/Go-by-Bike-Week": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Travel-Options/E-Bike-Share-Program": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Travel-Options/E-Cargo-Bikes": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Travel-Options/GoCNV": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Travel-Options/Look-Think-Go": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Travel-Options/Look-Think-Go/Elephant-s-Feet": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Travel-Options/Look-Think-Go/Road-Markings-and-Signs": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Travel-Options/Look-Think-Go/Videos": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Travel-Options/Safe-and-Active-School-Travel-Program": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Travel-Options/Safe-and-Active-School-Travel-Program/Best-Route-Maps-,-a-,amp;-School-Travel-Plans": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Travel-Options/Safe-and-Active-School-Travel-Program/Safe-and-Active-School-Travel-Program-Mini-Grants": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Travel-Options/Transit": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Travel-Options/Walking": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Streets-Transportation/Travel-Options/eScooters": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Training-Heavy-Rainfall": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/google-translate-disclaimer": [
          "#breadcrumbs-navigation"
        ]
      }
    },
    {
      "name": "form",
      "instances": [
        "div.mvc-form",
        "#mc_embed_signup"
      ],
      "pageInstances": {
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/115-East-Keith-Road": [
          "#fxb_c02f9068-fd48-4979-84d7-34434ac27917_Fields_2ac0da6d-749e-405a-9156-4a54514c2efa__Value",
          "#fxb_c02f9068-fd48-4979-84d7-34434ac27917_Fields_c831904a-9f52-49b9-9cc0-d908027da907__Value",
          "#fxb_c02f9068-fd48-4979-84d7-34434ac27917_118dc6e0-fdeb-422b-b477-ac544e4f9c34 > div.input-wrapper.input-radiolist > label:nth-child(2)",
          "#fxb_c02f9068-fd48-4979-84d7-34434ac27917_118dc6e0-fdeb-422b-b477-ac544e4f9c34 > div.input-wrapper.input-radiolist > label:nth-child(3)",
          "#fxb_c02f9068-fd48-4979-84d7-34434ac27917_118dc6e0-fdeb-422b-b477-ac544e4f9c34 > div.input-wrapper.input-radiolist > label:nth-child(4)",
          "#fxb_c02f9068-fd48-4979-84d7-34434ac27917_118dc6e0-fdeb-422b-b477-ac544e4f9c34 > div.input-wrapper.input-radiolist > label:nth-child(5)",
          "#fxb_c02f9068-fd48-4979-84d7-34434ac27917_Fields_b426d696-11a7-41f9-bdc1-b99be643ccf9__Value",
          "#fxb_c02f9068-fd48-4979-84d7-34434ac27917_Fields_25b0f505-0203-4b91-9146-0e55cb079942__Value",
          "#fxb_c02f9068-fd48-4979-84d7-34434ac27917_118dc6e0-fdeb-422b-b477-ac544e4f9c34 > input[type=submit]:nth-child(34)"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/222-East-2nd-Street": [
          "#fxb_51094ee2-1070-440d-a3ef-a92e41f19b1f_Fields_b8f72472-6a5d-411e-a869-ad96a12c7713__Value",
          "#fxb_51094ee2-1070-440d-a3ef-a92e41f19b1f_Fields_5802742f-24b9-4a80-90f7-b012385da6f2__Value",
          "#fxb_51094ee2-1070-440d-a3ef-a92e41f19b1f_473f7040-615a-4815-a496-bdd0dc2662a5 > div.input-wrapper.input-radiolist > label:nth-child(2)",
          "#fxb_51094ee2-1070-440d-a3ef-a92e41f19b1f_473f7040-615a-4815-a496-bdd0dc2662a5 > div.input-wrapper.input-radiolist > label:nth-child(3)",
          "#fxb_51094ee2-1070-440d-a3ef-a92e41f19b1f_473f7040-615a-4815-a496-bdd0dc2662a5 > div.input-wrapper.input-radiolist > label:nth-child(4)",
          "#fxb_51094ee2-1070-440d-a3ef-a92e41f19b1f_473f7040-615a-4815-a496-bdd0dc2662a5 > div.input-wrapper.input-radiolist > label:nth-child(5)",
          "#fxb_51094ee2-1070-440d-a3ef-a92e41f19b1f_Fields_cdcb6eab-8400-4e26-81f4-97089fdb55cd__Value",
          "#fxb_51094ee2-1070-440d-a3ef-a92e41f19b1f_Fields_f271008a-4e10-4e09-ae63-b42874e72c3f__Value",
          "#fxb_51094ee2-1070-440d-a3ef-a92e41f19b1f_473f7040-615a-4815-a496-bdd0dc2662a5 > input[type=submit]:nth-child(34)"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/412-East-5th-Street": [
          "#fxb_c5380e79-6099-4892-8f1f-3f61fd7bc232_Fields_f513b507-f141-496b-b2c0-5112a2538fde__Value",
          "#fxb_c5380e79-6099-4892-8f1f-3f61fd7bc232_Fields_8befa429-1b64-4b14-b2d9-50ca9fac3ac8__Value",
          "#fxb_c5380e79-6099-4892-8f1f-3f61fd7bc232_bc8cc6ce-8ae6-49d5-afb2-2e5f88495858 > div.input-wrapper.input-radiolist > label:nth-child(2)",
          "#fxb_c5380e79-6099-4892-8f1f-3f61fd7bc232_bc8cc6ce-8ae6-49d5-afb2-2e5f88495858 > div.input-wrapper.input-radiolist > label:nth-child(3)",
          "#fxb_c5380e79-6099-4892-8f1f-3f61fd7bc232_bc8cc6ce-8ae6-49d5-afb2-2e5f88495858 > div.input-wrapper.input-radiolist > label:nth-child(4)",
          "#fxb_c5380e79-6099-4892-8f1f-3f61fd7bc232_bc8cc6ce-8ae6-49d5-afb2-2e5f88495858 > div.input-wrapper.input-radiolist > label:nth-child(5)",
          "#fxb_c5380e79-6099-4892-8f1f-3f61fd7bc232_Fields_58d57448-5540-45d2-a8d7-e54f13671c81__Value",
          "#fxb_c5380e79-6099-4892-8f1f-3f61fd7bc232_Fields_82ea4ba7-a226-483a-95cc-bb4f2a93a918__Value",
          "#fxb_c5380e79-6099-4892-8f1f-3f61fd7bc232_bc8cc6ce-8ae6-49d5-afb2-2e5f88495858 > input[type=submit]:nth-child(34)"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/509-East-6th-Street": [
          "#fxb_ac17a1c7-e654-4236-9566-d5bc08525895_Fields_ca7a8e7c-77c3-4eb4-b9a7-2880d542c880__Value",
          "#fxb_ac17a1c7-e654-4236-9566-d5bc08525895_Fields_7cc08a9b-7076-4ecf-b997-4f6b72b16df0__Value",
          "#fxb_ac17a1c7-e654-4236-9566-d5bc08525895_e71dacaa-22fc-4cd4-833d-6f355d69e590 > div.input-wrapper.input-radiolist > label:nth-child(2)",
          "#fxb_ac17a1c7-e654-4236-9566-d5bc08525895_e71dacaa-22fc-4cd4-833d-6f355d69e590 > div.input-wrapper.input-radiolist > label:nth-child(3)",
          "#fxb_ac17a1c7-e654-4236-9566-d5bc08525895_e71dacaa-22fc-4cd4-833d-6f355d69e590 > div.input-wrapper.input-radiolist > label:nth-child(4)",
          "#fxb_ac17a1c7-e654-4236-9566-d5bc08525895_e71dacaa-22fc-4cd4-833d-6f355d69e590 > div.input-wrapper.input-radiolist > label:nth-child(5)",
          "#fxb_ac17a1c7-e654-4236-9566-d5bc08525895_Fields_4496f3a2-6d6f-459f-9e19-0f049c20cb77__Value",
          "#fxb_ac17a1c7-e654-4236-9566-d5bc08525895_Fields_c06ebbfa-5178-4690-8d57-6f2cb4ef8a0e__Value",
          "#fxb_ac17a1c7-e654-4236-9566-d5bc08525895_e71dacaa-22fc-4cd4-833d-6f355d69e590 > input[type=submit]:nth-child(34)"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/541-West-Keith-Road": [
          "#fxb_46586a3e-8f29-4d6a-b60a-8e9a29470ceb_Fields_cfe30988-38b2-4e11-bed1-d85586fd40bf__Value",
          "#fxb_46586a3e-8f29-4d6a-b60a-8e9a29470ceb_Fields_ecbb67c9-57f6-4a0c-8161-a8700e9df167__Value",
          "#fxb_46586a3e-8f29-4d6a-b60a-8e9a29470ceb_9d1c5a7b-4dd5-4348-a585-5bb54259afdf > div.input-wrapper.input-radiolist > label:nth-child(2)",
          "#fxb_46586a3e-8f29-4d6a-b60a-8e9a29470ceb_9d1c5a7b-4dd5-4348-a585-5bb54259afdf > div.input-wrapper.input-radiolist > label:nth-child(3)",
          "#fxb_46586a3e-8f29-4d6a-b60a-8e9a29470ceb_9d1c5a7b-4dd5-4348-a585-5bb54259afdf > div.input-wrapper.input-radiolist > label:nth-child(4)",
          "#fxb_46586a3e-8f29-4d6a-b60a-8e9a29470ceb_9d1c5a7b-4dd5-4348-a585-5bb54259afdf > div.input-wrapper.input-radiolist > label:nth-child(5)",
          "#fxb_46586a3e-8f29-4d6a-b60a-8e9a29470ceb_Fields_57fa3b97-b3c1-4f65-b819-a8d226ab500e__Value",
          "#fxb_46586a3e-8f29-4d6a-b60a-8e9a29470ceb_Fields_0f77f412-094d-4292-90a3-6da667a9e1d0__Value",
          "#fxb_46586a3e-8f29-4d6a-b60a-8e9a29470ceb_9d1c5a7b-4dd5-4348-a585-5bb54259afdf > input[type=submit]:nth-child(34)"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/648-West-14th-Street": [
          "#fxb_437c5a27-869e-4ddd-af28-b7a5f81325a1_Fields_3747723b-d362-49af-9fa7-69191442d879__Value",
          "#fxb_437c5a27-869e-4ddd-af28-b7a5f81325a1_Fields_86e7dcb6-699a-4927-9fde-3e863a638b04__Value",
          "#fxb_437c5a27-869e-4ddd-af28-b7a5f81325a1_98899577-7b03-4c71-9b14-9b15502698b0 > div.input-wrapper.input-radiolist > label:nth-child(2)",
          "#fxb_437c5a27-869e-4ddd-af28-b7a5f81325a1_98899577-7b03-4c71-9b14-9b15502698b0 > div.input-wrapper.input-radiolist > label:nth-child(3)",
          "#fxb_437c5a27-869e-4ddd-af28-b7a5f81325a1_98899577-7b03-4c71-9b14-9b15502698b0 > div.input-wrapper.input-radiolist > label:nth-child(4)",
          "#fxb_437c5a27-869e-4ddd-af28-b7a5f81325a1_98899577-7b03-4c71-9b14-9b15502698b0 > div.input-wrapper.input-radiolist > label:nth-child(5)",
          "#fxb_437c5a27-869e-4ddd-af28-b7a5f81325a1_Fields_8d2064e8-6482-4d65-a29a-505d7a1cd78e__Value",
          "#fxb_437c5a27-869e-4ddd-af28-b7a5f81325a1_Fields_998e484b-7256-46e8-9b29-2fb3099c8f89__Value",
          "#fxb_437c5a27-869e-4ddd-af28-b7a5f81325a1_98899577-7b03-4c71-9b14-9b15502698b0 > input[type=submit]:nth-child(34)"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/835---845-West-15th-Street": [
          "#fxb_23b843a7-e4d3-4293-8039-cb52043c4f85_Fields_c6f50064-66fc-4fa4-8eb2-53863fe36379__Value",
          "#fxb_23b843a7-e4d3-4293-8039-cb52043c4f85_Fields_143773e5-c1a7-45af-bb8e-7db7a0eed59f__Value",
          "#fxb_23b843a7-e4d3-4293-8039-cb52043c4f85_f692d2cc-87da-4a55-ae04-ab9c09c443a2 > div.input-wrapper.input-radiolist > label:nth-child(2)",
          "#fxb_23b843a7-e4d3-4293-8039-cb52043c4f85_f692d2cc-87da-4a55-ae04-ab9c09c443a2 > div.input-wrapper.input-radiolist > label:nth-child(3)",
          "#fxb_23b843a7-e4d3-4293-8039-cb52043c4f85_f692d2cc-87da-4a55-ae04-ab9c09c443a2 > div.input-wrapper.input-radiolist > label:nth-child(4)",
          "#fxb_23b843a7-e4d3-4293-8039-cb52043c4f85_f692d2cc-87da-4a55-ae04-ab9c09c443a2 > div.input-wrapper.input-radiolist > label:nth-child(5)",
          "#fxb_23b843a7-e4d3-4293-8039-cb52043c4f85_Fields_4fb602a2-d4ba-46a8-afc5-7307a0422695__Value",
          "#fxb_23b843a7-e4d3-4293-8039-cb52043c4f85_Fields_c74b5e3e-260d-4e0c-979b-39fa64a459ce__Value",
          "#fxb_23b843a7-e4d3-4293-8039-cb52043c4f85_f692d2cc-87da-4a55-ae04-ab9c09c443a2 > input[type=submit]:nth-child(34)"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/971-West-1st-Street": [
          "#fxb_2c2e68d2-295a-4da2-bdc0-f25c80a3e0da_Fields_0e831d36-be94-4854-b96b-61c624ffea2d__Value",
          "#fxb_2c2e68d2-295a-4da2-bdc0-f25c80a3e0da_Fields_8bad24d9-02d8-4b04-bc45-9ced849732ec__Value",
          "#fxb_2c2e68d2-295a-4da2-bdc0-f25c80a3e0da_f2a8f1f3-5a6c-471a-a3b0-b918232995a2 > div.input-wrapper.input-radiolist > label:nth-child(2)",
          "#fxb_2c2e68d2-295a-4da2-bdc0-f25c80a3e0da_f2a8f1f3-5a6c-471a-a3b0-b918232995a2 > div.input-wrapper.input-radiolist > label:nth-child(3)",
          "#fxb_2c2e68d2-295a-4da2-bdc0-f25c80a3e0da_f2a8f1f3-5a6c-471a-a3b0-b918232995a2 > div.input-wrapper.input-radiolist > label:nth-child(4)",
          "#fxb_2c2e68d2-295a-4da2-bdc0-f25c80a3e0da_f2a8f1f3-5a6c-471a-a3b0-b918232995a2 > div.input-wrapper.input-radiolist > label:nth-child(5)",
          "#fxb_2c2e68d2-295a-4da2-bdc0-f25c80a3e0da_Fields_c6fc06f1-5510-4c9b-b640-634be190eb67__Value",
          "#fxb_2c2e68d2-295a-4da2-bdc0-f25c80a3e0da_Fields_f97ae780-da6b-4dae-88ba-d16ebbca6b07__Value",
          "#fxb_2c2e68d2-295a-4da2-bdc0-f25c80a3e0da_f2a8f1f3-5a6c-471a-a3b0-b918232995a2 > input[type=submit]:nth-child(34)"
        ],
        "https://www.cnv.org/City-Hall/Bylaws": [
          "#txtSearchIndividualsByLawKeywords"
        ],
        "https://www.cnv.org/City-Hall/News-Room/CityConnect-Subscription": [
          "#mce-EMAIL",
          "#mc_embed_signup_scroll > div.show"
        ],
        "https://www.cnv.org/City-Hall/News-Room/CityView-eNewsletter-Subscribe": [
          "#mce-EMAIL",
          "#mc_embed_signup_scroll > div.show"
        ],
        "https://www.cnv.org/Comments": [
          "#fxb_c4328c26-3f75-475c-acdd-a346b0c3407a_Fields_bdfcadbc-68bd-4c1e-97d6-175272704a20__Value",
          "#fxb_c4328c26-3f75-475c-acdd-a346b0c3407a_Fields_5e0b11eb-e04f-4736-aeb8-f33e6c8fe86b__Value",
          "#fxb_c4328c26-3f75-475c-acdd-a346b0c3407a_d67a2ba8-8487-48f6-b2ce-fa78084af610 > div > div > input[type=submit]:nth-child(11)"
        ]
      }
    },
    {
      "name": "cards-gallery",
      "instances": [
        "div.galleria"
      ],
      "pageInstances": {
        "https://www.cnv.org/Business-Development/Filming-In-the-City/Film-Productions-in-the-City": [
          "#phcontent_0_phcontentsections_0_ctl06_gallery > div > div.galleria-stage",
          "#phcontent_0_phcontentsections_0_ctl06_gallery > div > div.galleria-thumbnails-container",
          "#phcontent_0_phcontentsections_0_ctl06_gallery > div > div.galleria-bar > div.galleria-fullscreen",
          "#phcontent_0_phcontentsections_0_ctl06_gallery > div > div.galleria-bar > div.galleria-play.playing",
          "#phcontent_0_phcontentsections_0_ctl06_gallery > div > div.galleria-bar > div.galleria-popout",
          "#phcontent_0_phcontentsections_0_ctl06_gallery > div > div.galleria-bar > div.galleria-thumblink",
          "#phcontent_0_phcontentsections_0_ctl06_gallery > div > div.galleria-bar > div.galleria-info",
          "#phcontent_0_phcontentsections_0_ctl06_gallery > div > div.galleria-bar > div.galleria-s1",
          "#phcontent_0_phcontentsections_0_ctl06_gallery > div > div.galleria-bar > div.galleria-s2",
          "#phcontent_0_phcontentsections_0_ctl06_gallery > div > div.galleria-bar > div.galleria-s3",
          "#phcontent_0_phcontentsections_0_ctl06_gallery > div > div.galleria-bar > div.galleria-s4"
        ],
        "https://www.cnv.org/Business-Development/Filming-In-the-City/Filming-Locations/Filming-at-The-Shipyards": [
          "#phcontent_0_phcontentsections_0_ctl17_gallery > div > div.galleria-stage",
          "#phcontent_0_phcontentsections_0_ctl17_gallery > div > div.galleria-bar > div.galleria-fullscreen",
          "#phcontent_0_phcontentsections_0_ctl17_gallery > div > div.galleria-bar > div.galleria-play.playing",
          "#phcontent_0_phcontentsections_0_ctl17_gallery > div > div.galleria-bar > div.galleria-popout",
          "#phcontent_0_phcontentsections_0_ctl17_gallery > div > div.galleria-bar > div.galleria-thumblink",
          "#phcontent_0_phcontentsections_0_ctl17_gallery > div > div.galleria-bar > div.galleria-info",
          "#phcontent_0_phcontentsections_0_ctl17_gallery > div > div.galleria-bar > div.galleria-s1",
          "#phcontent_0_phcontentsections_0_ctl17_gallery > div > div.galleria-bar > div.galleria-s2",
          "#phcontent_0_phcontentsections_0_ctl17_gallery > div > div.galleria-bar > div.galleria-s3",
          "#phcontent_0_phcontentsections_0_ctl17_gallery > div > div.galleria-bar > div.galleria-s4"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/Harry-Jerome-Community-Recreation-Centre/Explore-the-Project": [
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-stage",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-thumbnails-container",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-fullscreen",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-play.playing",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-popout",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-thumblink",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-info",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-s1",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-s2",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-s3",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-s4"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/North-Shore-Neighbourhood-House-Site-Redevelopment": [
          "#phcontent_0_phcontentsections_0_ctl10_gallery > div > div.galleria-stage > div.galleria-image-nav > div.galleria-image-nav-right",
          "#phcontent_0_phcontentsections_0_ctl10_gallery > div > div.galleria-stage > div.galleria-image-nav > div.galleria-image-nav-left",
          "#phcontent_0_phcontentsections_0_ctl10_gallery > div > div.galleria-thumbnails-container",
          "#phcontent_0_phcontentsections_0_ctl10_gallery > div > div.galleria-bar > div.galleria-fullscreen",
          "#phcontent_0_phcontentsections_0_ctl10_gallery > div > div.galleria-bar > div.galleria-play.playing",
          "#phcontent_0_phcontentsections_0_ctl10_gallery > div > div.galleria-bar > div.galleria-popout",
          "#phcontent_0_phcontentsections_0_ctl10_gallery > div > div.galleria-bar > div.galleria-thumblink",
          "#phcontent_0_phcontentsections_0_ctl10_gallery > div > div.galleria-bar > div.galleria-info",
          "#phcontent_0_phcontentsections_0_ctl10_gallery > div > div.galleria-bar > div.galleria-s1",
          "#phcontent_0_phcontentsections_0_ctl10_gallery > div > div.galleria-bar > div.galleria-s2",
          "#phcontent_0_phcontentsections_0_ctl10_gallery > div > div.galleria-bar > div.galleria-s3",
          "#phcontent_0_phcontentsections_0_ctl10_gallery > div > div.galleria-bar > div.galleria-s4"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/Past-Projects/Flicka-Gymnastics": [
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-stage",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-thumbnails-container",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-fullscreen",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-play.playing",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-popout",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-thumblink",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-info",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-s1",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-s2",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-s3",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-s4"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/Past-Projects/Mahon-Park-Childcare-Centre-Fieldhouse": [
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-stage",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-thumbnails-container",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-fullscreen",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-play.playing",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-popout",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-thumblink",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-info",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-s1",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-s2",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-s3",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-s4"
        ],
        "https://www.cnv.org/City-Hall/About/Sister-Cities": [
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-stage",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-thumbnails-container",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-fullscreen",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-play.playing",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-popout",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-thumblink",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-info",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-s1",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-s2",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-s3",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-s4"
        ],
        "https://www.cnv.org/Community-Environment/Environmental-Protection/Invasive-Species/Invasive-Plants": [
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-stage",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-thumbnails-container",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-fullscreen",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-play.playing",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-popout",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-thumblink",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-info",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-s1",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-s2",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-s3",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-s4"
        ],
        "https://www.cnv.org/Community-Environment/Help-Environment/City-Park-Stewards": [
          "#phcontent_0_phcontentsections_0_ctl11_gallery > div > div.galleria-stage",
          "#phcontent_0_phcontentsections_0_ctl11_gallery > div > div.galleria-thumbnails-container",
          "#phcontent_0_phcontentsections_0_ctl11_gallery > div > div.galleria-bar > div.galleria-fullscreen",
          "#phcontent_0_phcontentsections_0_ctl11_gallery > div > div.galleria-bar > div.galleria-play.playing",
          "#phcontent_0_phcontentsections_0_ctl11_gallery > div > div.galleria-bar > div.galleria-popout",
          "#phcontent_0_phcontentsections_0_ctl11_gallery > div > div.galleria-bar > div.galleria-thumblink",
          "#phcontent_0_phcontentsections_0_ctl11_gallery > div > div.galleria-bar > div.galleria-info",
          "#phcontent_0_phcontentsections_0_ctl11_gallery > div > div.galleria-bar > div.galleria-s1",
          "#phcontent_0_phcontentsections_0_ctl11_gallery > div > div.galleria-bar > div.galleria-s2",
          "#phcontent_0_phcontentsections_0_ctl11_gallery > div > div.galleria-bar > div.galleria-s3",
          "#phcontent_0_phcontentsections_0_ctl11_gallery > div > div.galleria-bar > div.galleria-s4"
        ],
        "https://www.cnv.org/Community-Environment/Help-Environment/Earth-Day": [
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-stage",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-thumbnails-container",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-fullscreen",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-play.playing",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-popout",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-thumblink",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-info",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-s1",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-s2",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-s3",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-s4"
        ],
        "https://www.cnv.org/Community-Environment/Help-Environment/Rivers-Day": [
          "#phcontent_0_phcontentsections_0_ctl06_gallery > div > div.galleria-stage",
          "#phcontent_0_phcontentsections_0_ctl06_gallery > div > div.galleria-thumbnails-container",
          "#phcontent_0_phcontentsections_0_ctl06_gallery > div > div.galleria-bar > div.galleria-fullscreen",
          "#phcontent_0_phcontentsections_0_ctl06_gallery > div > div.galleria-bar > div.galleria-play.playing",
          "#phcontent_0_phcontentsections_0_ctl06_gallery > div > div.galleria-bar > div.galleria-popout",
          "#phcontent_0_phcontentsections_0_ctl06_gallery > div > div.galleria-bar > div.galleria-thumblink",
          "#phcontent_0_phcontentsections_0_ctl06_gallery > div > div.galleria-bar > div.galleria-info",
          "#phcontent_0_phcontentsections_0_ctl06_gallery > div > div.galleria-bar > div.galleria-s1",
          "#phcontent_0_phcontentsections_0_ctl06_gallery > div > div.galleria-bar > div.galleria-s2",
          "#phcontent_0_phcontentsections_0_ctl06_gallery > div > div.galleria-bar > div.galleria-s3",
          "#phcontent_0_phcontentsections_0_ctl06_gallery > div > div.galleria-bar > div.galleria-s4"
        ],
        "https://www.cnv.org/Community-Environment/Open-Streets": [
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-stage",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-thumbnails-container",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-fullscreen",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-play.playing",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-popout",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-thumblink",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-info",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-s1",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-s2",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-s3",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-s4"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Local-Food/Loutet-Farm": [
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-stage",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-thumbnails-container",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-fullscreen",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-play.playing",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-popout",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-thumblink",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-info",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-s1",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-s2",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-s3",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-s4"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Youth": [
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-stage",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-thumbnails-container",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-fullscreen",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-play.playing",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-popout",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-thumblink",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-info",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-s1",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-s2",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-s3",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-s4"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Youth/CNV4ME/Kid-City": [
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-stage",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-thumbnails-container",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-fullscreen",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-play.playing",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-popout",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-thumblink",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-info",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-s1",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-s2",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-s3",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-s4"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Youth/CNV4ME/School-the-City": [
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-stage",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-thumbnails-container",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-fullscreen",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-play.playing",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-popout",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-thumblink",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-info",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-s1",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-s2",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-s3",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-s4"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Youth/Studio-in-the-City": [
          "#phcontent_0_phcontentsections_0_ctl22_gallery > div > div.galleria-stage",
          "#phcontent_0_phcontentsections_0_ctl22_gallery > div > div.galleria-thumbnails-container",
          "#phcontent_0_phcontentsections_0_ctl22_gallery > div > div.galleria-bar > div.galleria-fullscreen",
          "#phcontent_0_phcontentsections_0_ctl22_gallery > div > div.galleria-bar > div.galleria-play.playing",
          "#phcontent_0_phcontentsections_0_ctl22_gallery > div > div.galleria-bar > div.galleria-popout",
          "#phcontent_0_phcontentsections_0_ctl22_gallery > div > div.galleria-bar > div.galleria-thumblink",
          "#phcontent_0_phcontentsections_0_ctl22_gallery > div > div.galleria-bar > div.galleria-info",
          "#phcontent_0_phcontentsections_0_ctl22_gallery > div > div.galleria-bar > div.galleria-s1",
          "#phcontent_0_phcontentsections_0_ctl22_gallery > div > div.galleria-bar > div.galleria-s2",
          "#phcontent_0_phcontentsections_0_ctl22_gallery > div > div.galleria-bar > div.galleria-s3",
          "#phcontent_0_phcontentsections_0_ctl22_gallery > div > div.galleria-bar > div.galleria-s4"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Youth/Youth-Awards-Scholarships": [
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-stage",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-thumbnails-container",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-bar > div.galleria-fullscreen",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-bar > div.galleria-play.playing",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-bar > div.galleria-popout",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-bar > div.galleria-thumblink",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-bar > div.galleria-info",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-bar > div.galleria-s1",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-bar > div.galleria-s2",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-bar > div.galleria-s3",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-bar > div.galleria-s4"
        ],
        "https://www.cnv.org/Parks-Recreation/Annual-Events/Harbour-Beach": [
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-stage",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-thumbnails-container",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-fullscreen",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-play.playing",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-popout",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-thumblink",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-info",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-s1",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-s2",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-s3",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-s4"
        ],
        "https://www.cnv.org/Parks-Recreation/Annual-Events/Public-Works-Open-House": [
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-stage",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-thumbnails-container",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-fullscreen",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-play.playing",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-popout",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-thumblink",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-info",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-s1",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-s2",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-s3",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-s4"
        ],
        "https://www.cnv.org/Parks-Recreation/Arts-Culture/Public-Art": [
          "#phcontent_0_phcontentsections_0_ctl06_gallery > div > div.galleria-stage",
          "#phcontent_0_phcontentsections_0_ctl06_gallery > div > div.galleria-bar > div.galleria-fullscreen",
          "#phcontent_0_phcontentsections_0_ctl06_gallery > div > div.galleria-bar > div.galleria-play.playing",
          "#phcontent_0_phcontentsections_0_ctl06_gallery > div > div.galleria-bar > div.galleria-popout",
          "#phcontent_0_phcontentsections_0_ctl06_gallery > div > div.galleria-bar > div.galleria-thumblink",
          "#phcontent_0_phcontentsections_0_ctl06_gallery > div > div.galleria-bar > div.galleria-info",
          "#phcontent_0_phcontentsections_0_ctl06_gallery > div > div.galleria-bar > div.galleria-s1",
          "#phcontent_0_phcontentsections_0_ctl06_gallery > div > div.galleria-bar > div.galleria-s2",
          "#phcontent_0_phcontentsections_0_ctl06_gallery > div > div.galleria-bar > div.galleria-s3",
          "#phcontent_0_phcontentsections_0_ctl06_gallery > div > div.galleria-bar > div.galleria-s4"
        ],
        "https://www.cnv.org/Parks-Recreation/Cemetery": [
          "#phcontent_0_phcontentsections_0_ctl10_gallery > div > div.galleria-stage",
          "#phcontent_0_phcontentsections_0_ctl10_gallery > div > div.galleria-thumbnails-container",
          "#phcontent_0_phcontentsections_0_ctl10_gallery > div > div.galleria-bar > div.galleria-fullscreen",
          "#phcontent_0_phcontentsections_0_ctl10_gallery > div > div.galleria-bar > div.galleria-play.playing",
          "#phcontent_0_phcontentsections_0_ctl10_gallery > div > div.galleria-bar > div.galleria-popout",
          "#phcontent_0_phcontentsections_0_ctl10_gallery > div > div.galleria-bar > div.galleria-thumblink",
          "#phcontent_0_phcontentsections_0_ctl10_gallery > div > div.galleria-bar > div.galleria-info",
          "#phcontent_0_phcontentsections_0_ctl10_gallery > div > div.galleria-bar > div.galleria-s1",
          "#phcontent_0_phcontentsections_0_ctl10_gallery > div > div.galleria-bar > div.galleria-s2",
          "#phcontent_0_phcontentsections_0_ctl10_gallery > div > div.galleria-bar > div.galleria-s3",
          "#phcontent_0_phcontentsections_0_ctl10_gallery > div > div.galleria-bar > div.galleria-s4"
        ],
        "https://www.cnv.org/Parks-Recreation/City-Library": [
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-stage",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-thumbnails-container",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-bar > div.galleria-fullscreen",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-bar > div.galleria-play.playing",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-bar > div.galleria-popout",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-bar > div.galleria-thumblink",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-bar > div.galleria-info",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-bar > div.galleria-s1",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-bar > div.galleria-s2",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-bar > div.galleria-s3",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-bar > div.galleria-s4"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Greenways/Green-Necklace": [
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-stage",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-thumbnails-container",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-bar > div.galleria-fullscreen",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-bar > div.galleria-play.playing",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-bar > div.galleria-popout",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-bar > div.galleria-thumblink",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-bar > div.galleria-info",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-bar > div.galleria-s1",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-bar > div.galleria-s2",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-bar > div.galleria-s3",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-bar > div.galleria-s4"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Greenways/North-Shore-Spirit-Trail": [
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-stage",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-thumbnails-container",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-bar > div.galleria-fullscreen",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-bar > div.galleria-play.playing",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-bar > div.galleria-popout",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-bar > div.galleria-thumblink",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-bar > div.galleria-info",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-bar > div.galleria-s1",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-bar > div.galleria-s2",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-bar > div.galleria-s3",
          "#phcontent_0_phcontentsections_0_ctl08_gallery > div > div.galleria-bar > div.galleria-s4"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Park-Projects/Past-Projects/Topo-Park": [
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-stage",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-thumbnails-container",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-fullscreen",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-play.playing",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-popout",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-thumblink",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-info",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-s1",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-s2",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-s3",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-s4"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Parks": [
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-stage",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-thumbnails-container",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-fullscreen",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-play.playing",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-popout",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-thumblink",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-info",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-s1",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-s2",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-s3",
          "#phcontent_0_phcontentsections_0_ctl09_gallery > div > div.galleria-bar > div.galleria-s4"
        ],
        "https://www.cnv.org/Parks-Recreation/Play-CNV": [
          "#phcontent_0_phcontentsections_0_ctl11_gallery > div > div.galleria-stage",
          "#phcontent_0_phcontentsections_0_ctl11_gallery > div > div.galleria-thumbnails-container",
          "#phcontent_0_phcontentsections_0_ctl11_gallery > div > div.galleria-bar > div.galleria-fullscreen",
          "#phcontent_0_phcontentsections_0_ctl11_gallery > div > div.galleria-bar > div.galleria-play.playing",
          "#phcontent_0_phcontentsections_0_ctl11_gallery > div > div.galleria-bar > div.galleria-popout",
          "#phcontent_0_phcontentsections_0_ctl11_gallery > div > div.galleria-bar > div.galleria-thumblink",
          "#phcontent_0_phcontentsections_0_ctl11_gallery > div > div.galleria-bar > div.galleria-info",
          "#phcontent_0_phcontentsections_0_ctl11_gallery > div > div.galleria-bar > div.galleria-s1",
          "#phcontent_0_phcontentsections_0_ctl11_gallery > div > div.galleria-bar > div.galleria-s2",
          "#phcontent_0_phcontentsections_0_ctl11_gallery > div > div.galleria-bar > div.galleria-s3",
          "#phcontent_0_phcontentsections_0_ctl11_gallery > div > div.galleria-bar > div.galleria-s4"
        ],
        "https://www.cnv.org/Parks-Recreation/Play-CNV/Living-Lane": [
          "#phcontent_0_phcontentsections_0_ctl04_gallery > div > div.galleria-stage",
          "#phcontent_0_phcontentsections_0_ctl04_gallery > div > div.galleria-thumbnails-container",
          "#phcontent_0_phcontentsections_0_ctl04_gallery > div > div.galleria-bar > div.galleria-fullscreen",
          "#phcontent_0_phcontentsections_0_ctl04_gallery > div > div.galleria-bar > div.galleria-play.playing",
          "#phcontent_0_phcontentsections_0_ctl04_gallery > div > div.galleria-bar > div.galleria-popout",
          "#phcontent_0_phcontentsections_0_ctl04_gallery > div > div.galleria-bar > div.galleria-thumblink",
          "#phcontent_0_phcontentsections_0_ctl04_gallery > div > div.galleria-bar > div.galleria-info",
          "#phcontent_0_phcontentsections_0_ctl04_gallery > div > div.galleria-bar > div.galleria-s1",
          "#phcontent_0_phcontentsections_0_ctl04_gallery > div > div.galleria-bar > div.galleria-s2",
          "#phcontent_0_phcontentsections_0_ctl04_gallery > div > div.galleria-bar > div.galleria-s3",
          "#phcontent_0_phcontentsections_0_ctl04_gallery > div > div.galleria-bar > div.galleria-s4"
        ],
        "https://www.cnv.org/Parks-Recreation/Public-Spaces/Civic-Plaza": [
          "#phcontent_0_phcontentsections_0_ctl03_gallery > div > div.galleria-stage",
          "#phcontent_0_phcontentsections_0_ctl03_gallery > div > div.galleria-thumbnails-container",
          "#phcontent_0_phcontentsections_0_ctl03_gallery > div > div.galleria-bar > div.galleria-fullscreen",
          "#phcontent_0_phcontentsections_0_ctl03_gallery > div > div.galleria-bar > div.galleria-play.playing",
          "#phcontent_0_phcontentsections_0_ctl03_gallery > div > div.galleria-bar > div.galleria-popout",
          "#phcontent_0_phcontentsections_0_ctl03_gallery > div > div.galleria-bar > div.galleria-thumblink",
          "#phcontent_0_phcontentsections_0_ctl03_gallery > div > div.galleria-bar > div.galleria-info",
          "#phcontent_0_phcontentsections_0_ctl03_gallery > div > div.galleria-bar > div.galleria-s1",
          "#phcontent_0_phcontentsections_0_ctl03_gallery > div > div.galleria-bar > div.galleria-s2",
          "#phcontent_0_phcontentsections_0_ctl03_gallery > div > div.galleria-bar > div.galleria-s3",
          "#phcontent_0_phcontentsections_0_ctl03_gallery > div > div.galleria-bar > div.galleria-s4"
        ],
        "https://www.cnv.org/Parks-Recreation/Public-Spaces/Lower-Lonsdale": [
          "#phcontent_0_phcontentsections_0_ctl03_gallery > div > div.galleria-stage",
          "#phcontent_0_phcontentsections_0_ctl03_gallery > div > div.galleria-thumbnails-container",
          "#phcontent_0_phcontentsections_0_ctl03_gallery > div > div.galleria-bar > div.galleria-fullscreen",
          "#phcontent_0_phcontentsections_0_ctl03_gallery > div > div.galleria-bar > div.galleria-play.playing",
          "#phcontent_0_phcontentsections_0_ctl03_gallery > div > div.galleria-bar > div.galleria-popout",
          "#phcontent_0_phcontentsections_0_ctl03_gallery > div > div.galleria-bar > div.galleria-thumblink",
          "#phcontent_0_phcontentsections_0_ctl03_gallery > div > div.galleria-bar > div.galleria-info",
          "#phcontent_0_phcontentsections_0_ctl03_gallery > div > div.galleria-bar > div.galleria-s1",
          "#phcontent_0_phcontentsections_0_ctl03_gallery > div > div.galleria-bar > div.galleria-s2",
          "#phcontent_0_phcontentsections_0_ctl03_gallery > div > div.galleria-bar > div.galleria-s3",
          "#phcontent_0_phcontentsections_0_ctl03_gallery > div > div.galleria-bar > div.galleria-s4"
        ],
        "https://www.cnv.org/Parks-Recreation/Public-Spaces/Rogers-Plaza": [
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-stage > div.galleria-image-nav > div.galleria-image-nav-right",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-stage > div.galleria-image-nav > div.galleria-image-nav-left",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-thumbnails-container",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-fullscreen",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-play.playing",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-popout",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-thumblink",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-info",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-s1",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-s2",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-s3",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-s4"
        ],
        "https://www.cnv.org/Parks-Recreation/The-Shipyards/Skate-Plaza": [
          "#phcontent_0_phcontentsections_0_ctl12_gallery > div > div.galleria-stage",
          "#phcontent_0_phcontentsections_0_ctl12_gallery > div > div.galleria-thumbnails-container",
          "#phcontent_0_phcontentsections_0_ctl12_gallery > div > div.galleria-bar > div.galleria-fullscreen",
          "#phcontent_0_phcontentsections_0_ctl12_gallery > div > div.galleria-bar > div.galleria-play.playing",
          "#phcontent_0_phcontentsections_0_ctl12_gallery > div > div.galleria-bar > div.galleria-popout",
          "#phcontent_0_phcontentsections_0_ctl12_gallery > div > div.galleria-bar > div.galleria-thumblink",
          "#phcontent_0_phcontentsections_0_ctl12_gallery > div > div.galleria-bar > div.galleria-info",
          "#phcontent_0_phcontentsections_0_ctl12_gallery > div > div.galleria-bar > div.galleria-s1",
          "#phcontent_0_phcontentsections_0_ctl12_gallery > div > div.galleria-bar > div.galleria-s2",
          "#phcontent_0_phcontentsections_0_ctl12_gallery > div > div.galleria-bar > div.galleria-s3",
          "#phcontent_0_phcontentsections_0_ctl12_gallery > div > div.galleria-bar > div.galleria-s4"
        ],
        "https://www.cnv.org/Streets-Transportation/Travel-Options": [
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-stage",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-thumbnails-container",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-fullscreen",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-play.playing",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-popout",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-thumblink",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-info",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-s1",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-s2",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-s3",
          "#phcontent_0_phcontentsections_0_ctl05_gallery > div > div.galleria-bar > div.galleria-s4"
        ],
        "https://www.cnv.org/Streets-Transportation/Travel-Options/Safe-and-Active-School-Travel-Program/Best-Route-Maps-,-a-,amp;-School-Travel-Plans": [
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-stage",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-thumbnails-container",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-fullscreen",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-play.playing",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-popout",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-thumblink",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-info",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-s1",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-s2",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-s3",
          "#phcontent_0_phcontentsections_0_ctl07_gallery > div > div.galleria-bar > div.galleria-s4"
        ],
        "https://www.cnv.org/Streets-Transportation/Travel-Options/Safe-and-Active-School-Travel-Program/Safe-and-Active-School-Travel-Program-Mini-Grants": [
          "#phcontent_0_phcontentsections_0_ctl11_gallery > div > div.galleria-stage > div.galleria-image-nav > div.galleria-image-nav-right",
          "#phcontent_0_phcontentsections_0_ctl11_gallery > div > div.galleria-stage > div.galleria-image-nav > div.galleria-image-nav-left",
          "#phcontent_0_phcontentsections_0_ctl11_gallery > div > div.galleria-thumbnails-container",
          "#phcontent_0_phcontentsections_0_ctl11_gallery > div > div.galleria-bar > div.galleria-fullscreen",
          "#phcontent_0_phcontentsections_0_ctl11_gallery > div > div.galleria-bar > div.galleria-play.playing",
          "#phcontent_0_phcontentsections_0_ctl11_gallery > div > div.galleria-bar > div.galleria-popout",
          "#phcontent_0_phcontentsections_0_ctl11_gallery > div > div.galleria-bar > div.galleria-thumblink",
          "#phcontent_0_phcontentsections_0_ctl11_gallery > div > div.galleria-bar > div.galleria-info",
          "#phcontent_0_phcontentsections_0_ctl11_gallery > div > div.galleria-bar > div.galleria-s1",
          "#phcontent_0_phcontentsections_0_ctl11_gallery > div > div.galleria-bar > div.galleria-s2",
          "#phcontent_0_phcontentsections_0_ctl11_gallery > div > div.galleria-bar > div.galleria-s3",
          "#phcontent_0_phcontentsections_0_ctl11_gallery > div > div.galleria-bar > div.galleria-s4"
        ]
      }
    },
    {
      "name": "video-date-select",
      "instances": [
        "#page-content > div:has(> select[id$='_dwnVideos'])"
      ],
      "pageInstances": {
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2012-Meetings/Council-Videos": [
          "#content-columns > div > div.content.layout-columns"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2013-Meetings/Council-Videos": [
          "#content-columns > div > div.content.layout-columns"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2014-Meetings/Council-Videos": [
          "#content-columns > div > div.content.layout-columns"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2015-Meetings/Council-Videos": [
          "#content-columns > div > div.content.layout-columns"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2016-Meetings/Council-Videos": [
          "#content-columns > div > div.content.layout-columns"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2017-Meetings/Council-Videos": [
          "#content-columns > div > div.content.layout-columns"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2018-Meetings/Council-Videos": [
          "#content-columns > div > div.content.layout-columns"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2019-Meetings/Council-Videos": [
          "#content-columns > div > div.content.layout-columns"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2020-Meetings/Council-Videos": [
          "#content-columns > div > div.content.layout-columns"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2021-Meetings/Council-Videos": [
          "#content-columns > div > div.content.layout-columns"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2022-Meetings/Council-Videos": [
          "#content-columns > div > div.content.layout-columns"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2023-Meetings/Council-Videos": [
          "#content-columns > div > div.content.layout-columns"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2024-Meetings/Council-Videos": [
          "#content-columns > div > div.content.layout-columns"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2025-Meetings/Council-Videos": [
          "#content-columns > div > div.content.layout-columns"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2026-Meetings/Council-Videos": [
          "#content-columns > div > div.content.layout-columns"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Videos/2003-Council-Videos": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > label"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Videos/2004-Council-Videos": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > label"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Videos/2005-Council-Videos": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > label"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Videos/2006-Council-Videos": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > label"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Videos/2007-Council-Videos": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > label"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Videos/2008-Council-Videos": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > label"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Videos/2009-Council-Videos": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > label"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Videos/2010-Council-Videos": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > label"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Videos/2011-Council-Videos": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > label"
        ]
      }
    },
    {
      "name": "listing-filter",
      "instances": [
        "div.filterHeader"
      ],
      "pageInstances": {
        "https://www.cnv.org/Business-Development/Bid-Notices": [
          "#page-content > div:nth-child(2) > div.filterHeader"
        ],
        "https://www.cnv.org/City-Hall/About/Awards": [
          "#page-content > div:nth-child(2) > div.filterHeader"
        ],
        "https://www.cnv.org/City-Hall/About/Maps/Map-Catalogue": [
          "#page-content > div:nth-child(2) > div.filterHeader"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos": [
          "#page-content-section > div.filterHeader.councilMeetingsFilter"
        ],
        "https://www.cnv.org/City-Hall/News-Room": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.filterHeader > div:nth-child(1)"
        ],
        "https://www.cnv.org/City-Hall/News-Room/CityView-eNewsletter": [
          "#page-content > div:nth-child(2) > div.filterHeader"
        ],
        "https://www.cnv.org/City-Hall/News-Room/News-Releases": [
          "#page-content > div:nth-child(2) > div.filterHeader > div:nth-child(1)"
        ]
      }
    },
    {
      "name": "notice",
      "instances": [
        ".content-section > div.call-out-info.call-out-icon"
      ],
      "pageInstances": {
        "https://www.cnv.org/Business-Development/Building/Development-Cost-Charges": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1036-Grand-Boulevard": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/114-118-and-122-132-West-15th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/115-East-1st-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/115-East-Keith-Road": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1220-St-Georges": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1225-East-Keith-Road": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/124-W-20th-St": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/125-145-East-13th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/125-East-20th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/127-129-East-12th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1311-Lonsdale-Avenue": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/133-East-4th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1357-Jones-Avenue": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/140-West-19th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/144-West-21st-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1441-St-Georges-Avenue": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/145-153-East-4th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/146-160-East-2nd-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/149-West-3rd-Street-old": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/150-East-8th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/151-East-Keith-Road": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1540-Georges-Avenue-and-215-235-East-16th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1612-St-Georges-Avenue": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2008-Westview": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2045-Fell-Avenue": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/205-St,-d-,-Patricks-Avenue": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/210-230-E-2nd-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2121-2129-2137-Chesterfield-Avenue": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/213-E-22nd-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/214-East-Esplanade": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2212-St-Georges-Avenue": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/222-East-2nd-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/226-West-5th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/229-231-West-15th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/229-East-22nd-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/233-E-22nd-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/234-East-25th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/236-254-East-3rd-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/245-East-10th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/245-West-27th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/250-East-15th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2540-2590-Lonsdale-Avenue": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/259-East-23rd-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/261-263-West-6th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/266-East-1st-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/275-East-2nd-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2762-Lonsdale-Avenue": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/309-311-West-1st-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/309-Kennard-Avenue": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/311-Moody-Avenue": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/311-West-14th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/317-West-20th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/322-West-14th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/332-East-24th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/332-West-16th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/341-347-West-4th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/341-West-24th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/350-East-2nd-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/351-West-3rd-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/352-West-15th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/357-East-22nd-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/364-East-14th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/365-East-22nd-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/365-West-19th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/402-438-East-3rd-St-and-341-343-St-Davids-Ave": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/407-West-16th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/412-East-5th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/417-West-14th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/427-429-and-433-435-E-3rd-St": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/429-East-15th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/442-444-East-1st-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/452-East-1st-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/453-West-24th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/464-West-28th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/467-East-2nd-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/502-East-3rd-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/502-East-5th": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/548-558-East-1st-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/602-East-2nd": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/618-East-4th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/63-Mahon-Avenue": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/630-Brooksbank-Avenue": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/639-East-4th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/646-East-4th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/648-West-14th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/705-717-West-15th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/720-Copping-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/758-762-East-3rd-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/758-Harbourside-Drive": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/758-Harbourside-Drive-Temporary-Use-Permit": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/800-Marine-Drive": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/818-858-West-15th-St": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/833-Automall-Drive": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/864-East-14th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/880-West-15th-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/905-Ridgeway-Avenue": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/971-West-1st-Street": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Zoning": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Building/Subdivisions": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Business-Licences/Food-Trucks": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Business-Licences/Recreational-Cannabis-Retail": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Economic-Development/Business-Improvement-Area": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Economic-Development/Economic-Strategy": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Filming-In-the-City/Film-Bursary": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Heritage": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Permits-Inspections": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Permits-Inspections/Building-Permits": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Permits-Inspections/Building-Permits/How-to-Submit-Construction-Permits": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Permits-Inspections/Building-Permits/New-Coach-House": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Permits-Inspections/Building-Permits/New-Garages-Carports": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Permits-Inspections/Building-Permits/New-Single-and-Two-Family-Dwellings": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Permits-Inspections/Building-Permits/Secondary-Suites": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Permits-Inspections/Electrical-Permit-Application-Forms-and-Information": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Permits-Inspections/Inspections": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Permits-Inspections/Plumbing-and-Gas-Permit-Application-Forms-and-Information": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Business-Development/Permits-Inspections/Sign-Permit-Application-Forms-and-Information": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/Harbour-Deck": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/Harry-Jerome-Community-Recreation-Centre": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/Harry-Jerome-Community-Recreation-Centre/Construction": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/North-Shore-Neighbourhood-House-Site-Redevelopment": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/Past-Projects/Duplex-Special-Study": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/Past-Projects/Lonsdale-Great-Street-Project": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/City-Hall/Bylaws/Noise-Control": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/City-Hall/Careers/Living-Wage": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/City-Hall/Contact": [
          "#phcontent_0_phwidgetscontent_0_ctl02_pnlEventsWidget"
        ],
        "https://www.cnv.org/City-Hall/Contact/Complaints": [
          "#phcontent_0_phwidgetscontent_0_ctl02_pnlEventsWidget"
        ],
        "https://www.cnv.org/City-Hall/Contact/Respectful-Communication-Policy": [
          "#phcontent_0_phwidgetscontent_0_ctl02_pnlEventsWidget"
        ],
        "https://www.cnv.org/City-Hall/Contact/Social-Media": [
          "#phcontent_0_phwidgetscontent_0_ctl02_pnlEventsWidget"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Meeting-Live-Streaming": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Public-Input-Period": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div:nth-child(2)",
          "#phcontent_0_phcontentsections_0_pnlContentSection > div:nth-child(3)"
        ],
        "https://www.cnv.org/City-Hall/Finances/Financial-Plan": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/City-Hall/General-Local-Election": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/City-Hall/General-Local-Election/2026-General-Local-Election": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/City-Hall/Online-Services/Dog-Licences": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/City-Hall/Truth-and-Reconciliation": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div:nth-child(1)",
          "#phcontent_0_phcontentsections_0_pnlContentSection > div:nth-child(5)"
        ],
        "https://www.cnv.org/Community-Environment/Energy/Jump-on-a-New-Heat-Pump-New": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Community-Environment/Grants-Funding/Children-and-Youth-Grants": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Community-Environment/Grants-Funding/Community-Grants": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Community-Environment/Grants-Funding/Culture-Makes-The-City-Grants": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Community-Environment/Help-Environment/Earth-Hour": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Community-Environment/Housing/Housing-Needs-Report": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Community-Environment/Housing/Provincial-Housing-Legislation-Updates/Growing-Livable-Neighbourhoods": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Community-Environment/Living-City/Living-City-Awards": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Community-Environment/Living-City/Living-City-Grant": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Local-Food/Loutet-Farm": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Youth/Youth-Awards-Scholarships": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Youth/Youth-Awards-Scholarships/Civic-Youth-Awards": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Youth/Youth-Awards-Scholarships/Youth-Centennial-Scholarship": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Home-Property/Emergency-Preparedness/Extreme-Cold": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Home-Property/Emergency-Preparedness/Snowfall": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Home-Property/Garbage-Recycling-Green-Can/Wildlife-Awareness": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Home-Property/Property-Taxes": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Home-Property/Property-Taxes/Annual-Tax-Sale-of-Property": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Home-Property/Property-Taxes/Preauthorized-Tax-Payment": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Home-Property/Utility-Rates": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Parks-Recreation/Annual-Events/Hot-Summer-Nights": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Parks-Recreation/Cemetery": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Parks-Recreation/Cemetery/Already-Interred": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Greenways/Upper-Levels-Greenway-System": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Park-Projects/1600-Eastern-Park": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Park-Projects/CNV-Parks-and-Public-Space-Plan": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Park-Projects/Eastview-Park": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Park-Projects/Flight-PS752-Memorial": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Park-Projects/Kings-Mill-Walk-Park-Master-Plan": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Park-Projects/Ray-Perrault-Park-Expansion": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Parks-Recreation/Play-CNV/Parklets": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Parks-Recreation/Play-CNV/Play-Boxes": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Parks-Recreation/Recreation/Lawn-Bowling": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Parks-Recreation/The-Shipyards/Shipbuilders'-Square": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Parks-Recreation/The-Shipyards/Shipyard-Commons": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Parks-Recreation/The-Shipyards/Skate-Plaza": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Parks-Recreation/The-Shipyards/Splash-Park": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Streets-Transportation/Parking/Parking-Rules-and-Regulations": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Streets-Transportation/Parking/Pay-Parking": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Streets-Transportation/Transportation-Planning/Walk-CNV": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Streets-Transportation/Transportation-Projects/Crosscut-Bridge": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Streets-Transportation/Transportation-Projects/Past-Projects/1st-Street-Mobility-Corridor": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div:nth-child(1)",
          "#phcontent_0_phcontentsections_0_pnlContentSection > div:nth-child(2)"
        ],
        "https://www.cnv.org/Streets-Transportation/Transportation-Projects/Past-Projects/Cloverley": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Streets-Transportation/Transportation-Projects/Past-Projects/Ridgeway-School-Zone-Safety-Review": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Streets-Transportation/Travel-Options/Cycling/Go-by-Bike-Week": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Streets-Transportation/Travel-Options/Safe-and-Active-School-Travel-Program/Safe-and-Active-School-Travel-Program-Mini-Grants": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Streets-Transportation/Travel-Options/eScooters": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ]
      }
    },
    {
      "name": "table-data",
      "instances": [
        ".accordion-item-content table",
        ".infoPanel > div > div > table",
        ".infoPanel > div > table",
        ".infoPanel table",
        "div.council-meeting-table"
      ],
      "pageInstances": {
        "https://www.cnv.org/Business-Development/Building/Development-Cost-Charges": [
          "#phcontent_0_phcontentsections_0_ctl06_pnlInfo > div:nth-child(2) > table:nth-child(17)",
          "#phcontent_0_phcontentsections_0_ctl06_pnlInfo > div:nth-child(2) > table:nth-child(21)"
        ],
        "https://www.cnv.org/Business-Development/Building/Energy-Efficient-Buildings-Initiative/New-Buildings": [
          "#phcontent_0_phcontentsections_0_ctl02_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals": [
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1036-Grand-Boulevard": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/114-118-and-122-132-West-15th-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table:nth-child(6)"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/115-East-18th-Street": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/115-East-1st-Street": [
          "#phcontent_0_phcontentsections_0_ctl05_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/115-East-Keith-Road": [
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/115-West-Esplanade-Street": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/119-East-2nd-Street": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table:nth-child(7)"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/120-East-14th-Street": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1220-St-Georges": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > div:nth-child(3) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1225-East-Keith-Road": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/124-W-20th-St": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table:nth-child(6)"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/125-145-East-13th-Street": [
          "#phcontent_0_phcontentsections_0_ctl06_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/125-East-20th-Street": [
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/125-Victory-Ship-Way": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/127-129-East-12th-Street": [
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1311-Lonsdale-Avenue": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/133-East-4th-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1357-Jones-Avenue": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/140-West-19th-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1421-Fell-Avenue": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/144-West-21st-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1441-St-Georges-Avenue": [
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/145-153-East-4th-Street": [
          "#phcontent_0_phcontentsections_0_ctl05_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/146-160-East-2nd-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/149-West-3rd-Street-old": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/150-East-8th-Street": [
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/151-East-Keith-Road": [
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1536-1550-Eastern-Avenue": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/154-East-17th-Street": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1540-Georges-Ave-and-215-235-East-16th-Street": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1540-Georges-Avenue-and-215-235-East-16th-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1540-St-Georges": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1553-Sutherland-Avenue": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1612-St-Georges-Avenue": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/1712-Lonsdale-Avenue": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > div:nth-child(3) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2000-Wolfe-Street": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2008-Westview": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2024-Mackay-Avenue": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2045-Fell-Avenue": [
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/205-St,-d-,-Patricks-Avenue": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/210-230-E-2nd-Street": [
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2121-2129-2137-Chesterfield-Avenue": [
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/213-E-22nd-Street": [
          "#phcontent_0_phcontentsections_0_ctl05_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/214-East-Esplanade": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/215-West-Keith-Road": [
          "#phcontent_0_phcontentsections_0_ctl02_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl02_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/216-East-3rd-Street": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2212-St-Georges-Avenue": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/222-East-2nd-Street": [
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/226-West-5th-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/229-231-West-15th-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/229-East-22nd-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/233-E-22nd-Street": [
          "#phcontent_0_phcontentsections_0_ctl05_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/234-East-25th-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/236-254-East-3rd-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2416-Western-Avenue": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/245-East-10th-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/245-West-27th-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/250-East-15th-Street": [
          "#phcontent_0_phcontentsections_0_ctl05_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2525-Lonsdale-Avenue": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/253-East-28th-Street": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2540-2590-Lonsdale-Avenue": [
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/259-East-23rd-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/259-West-Keith-Road": [
          "#phcontent_0_phcontentsections_0_ctl02_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl02_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/261-263-West-6th-Street": [
          "#phcontent_0_phcontentsections_0_ctl05_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2612-Lonsdale-Avenue": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/266-East-1st-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/273-279-E-6th-Street": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/275-East-2nd-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/2762-Lonsdale-Avenue": [
          "#phcontent_0_phcontentsections_0_ctl05_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/309-Kennard-Avenue": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/311-Moody-Avenue": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/311-West-14th-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/317-West-20th-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/321-West-4th-Street": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/322-West-14th-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table:nth-child(7)"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/328-East-14th-Street": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/328-West-14th-Street": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/332-East-24th-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/332-West-16th-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/333-West-20th-Street": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/341-347-West-4th-Street": [
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/341-West-24th-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/350-East-2nd-Street": [
          "#phcontent_0_phcontentsections_0_ctl05_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/351-West-3rd-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/352-West-15th-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/357-East-22nd-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/364-East-14th-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/365-East-22nd-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/365-West-19th-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/380-East-1st-Street": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/400-East-1st-Street": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/402-438-East-3rd-St-and-341-343-St-Davids-Ave": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/407-West-16th-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/412-East-11th-Street": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/412-East-5th-Street": [
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/417-West-14th-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/422-East-1st-Street": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/427-429-and-433-435-E-3rd-St": [
          "#phcontent_0_phcontentsections_0_ctl05_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/429-East-15th-Street": [
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/442-444-East-1st-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/442-East-16th-Street": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/450-West-15th-Street": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/452-East-1st-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/453-West-24th-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/457-West-14th-Street": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/462-East-11th-Street": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/464-West-28th-Street": [
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/467-East-2nd-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/502-East-3rd-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/502-East-5th": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > div:nth-child(3) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/509-East-6th-Street": [
          "#phcontent_0_phcontentsections_0_ctl02_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl02_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/528-East-7th-Street": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/540-West-21st-Street": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/541-West-Keith-Road": [
          "#phcontent_0_phcontentsections_0_ctl02_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl02_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/548-558-East-1st-Street": [
          "#phcontent_0_phcontentsections_0_ctl05_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/602-East-2nd": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/618-East-4th-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/63-Mahon-Avenue": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/630-Brooksbank-Avenue": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/639-East-4th-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/642-East-6th-Street": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/645-Mahon-Avenue": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/646-East-4th-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/648-West-14th-Street": [
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/652-East-4th-Street": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/705-717-West-15th-Street": [
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/720-Copping-Street": [
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/758-762-East-3rd-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/758-Harbourside-Drive": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/758-Harbourside-Drive-Temporary-Use-Permit": [
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/800-Marine-Drive": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table:nth-child(6)"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/818-858-West-15th-St": [
          "#phcontent_0_phcontentsections_0_ctl05_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/822-E-4th-Street": [
          "#phcontent_0_phcontentsections_0_ctl02_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl02_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/833-Automall-Drive": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/835---845-West-15th-Street": [
          "#phcontent_0_phcontentsections_0_ctl02_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl02_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/842-East-5th-Street": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/844-East-6th-Street": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/864-East-14th-Street": [
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > table.table",
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/880-West-15th-Street": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/905-Ridgeway-Avenue": [
          "#phcontent_0_phcontentsections_0_ctl05_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/971-West-1st-Street": [
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > div > table.table",
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > div > table.noZebraStripes"
        ],
        "https://www.cnv.org/Business-Development/Economic-Development/Business-Improvement-Area": [
          "#phcontent_0_phcontentsections_0_ctl06_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Filming-In-the-City/Filming-Locations/Filming-in-City-Hall": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table:nth-child(5)",
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table:nth-child(9)",
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table:nth-child(15)"
        ],
        "https://www.cnv.org/City-Hall/Claims-and-Causes-of-Loss/Causes-of-Loss": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/City-Hall/Claims-and-Causes-of-Loss/Claims": [
          "#phcontent_0_phcontentsections_0_ctl02_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/City-Hall/Committees/Advisory-Design-Panel": [
          "#phcontent_0_phcontentsections_0_ctl02_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/City-Hall/Committees/Advisory-Planning-Commission": [
          "#phcontent_0_phcontentsections_0_ctl02_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/City-Hall/Committees/Board-of-Variance": [
          "#phcontent_0_phcontentsections_0_ctl02_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/City-Hall/Committees/Community-Safety-Advisory-Committee": [
          "#phcontent_0_phcontentsections_0_ctl02_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/City-Hall/Committees/Heritage-Advisory-Committee": [
          "#phcontent_0_phcontentsections_0_ctl02_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/City-Hall/Committees/Integrated-Transportation-Committee": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/City-Hall/Committees/North-Shore-Accessibility-Advisory-Committee": [
          "#phcontent_0_phcontentsections_0_ctl02_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/City-Hall/Committees/North-Vancouver-City-Library-Board": [
          "#phcontent_0_phcontentsections_0_ctl02_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/City-Hall/Committees/North-Vancouver-Museum-and-Archives-Commission": [
          "#phcontent_0_phcontentsections_0_ctl02_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/City-Hall/Committees/North-Vancouver-Policing-Committee": [
          "#phcontent_0_phcontentsections_0_ctl02_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/City-Hall/Committees/North-Vancouver-Public-Art-Advisory-Committee": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/City-Hall/Committees/North-Vancouver-Recreation-and-Culture-Commission": [
          "#phcontent_0_phcontentsections_0_ctl02_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/City-Hall/Committees/Social-Planning-Advisory-Committee": [
          "#phcontent_0_phcontentsections_0_ctl02_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/City-Hall/Contact/Social-Media": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos": [
          "#phcontent_0_phcontentsections_1_ctl00_UpdatePanel > div.council-meeting-table"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2012-Meetings": [
          "#phcontent_0_phgeneralpagecontent_0_UpdatePanel > div.council-meeting-table"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2013-Meetings": [
          "#phcontent_0_phgeneralpagecontent_0_UpdatePanel > div.council-meeting-table"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2014-Meetings": [
          "#phcontent_0_phgeneralpagecontent_0_UpdatePanel > div.council-meeting-table"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2015-Meetings": [
          "#phcontent_0_phgeneralpagecontent_0_UpdatePanel > div.council-meeting-table"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2016-Meetings": [
          "#phcontent_0_phgeneralpagecontent_0_UpdatePanel"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2017-Meetings": [
          "#phcontent_0_phgeneralpagecontent_0_UpdatePanel > div.council-meeting-table"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2018-Meetings": [
          "#phcontent_0_phgeneralpagecontent_0_UpdatePanel > div.council-meeting-table"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2019-Meetings": [
          "#phcontent_0_phgeneralpagecontent_0_UpdatePanel > div.council-meeting-table"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2020-Meetings": [
          "#phcontent_0_phgeneralpagecontent_0_UpdatePanel > div.council-meeting-table"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2021-Meetings": [
          "#phcontent_0_phgeneralpagecontent_0_UpdatePanel > div.council-meeting-table"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2022-Meetings": [
          "#phcontent_0_phgeneralpagecontent_0_UpdatePanel > div.council-meeting-table"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2023-Meetings": [
          "#phcontent_0_phgeneralpagecontent_0_UpdatePanel > div.council-meeting-table"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2024-Meetings": [
          "#phcontent_0_phgeneralpagecontent_0_UpdatePanel > div.council-meeting-table"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2025-Meetings": [
          "#phcontent_0_phgeneralpagecontent_0_UpdatePanel > div.council-meeting-table"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2026-Meetings": [
          "#phcontent_0_phgeneralpagecontent_0_UpdatePanel > div.council-meeting-table"
        ],
        "https://www.cnv.org/Community-Environment/Grants-Funding/Child-Care-Capital-Improvement-Fund": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Community-Environment/Housing/Housing-Target-Report": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Home-Property/Safety/RCMP/Additional-Resources": [
          "#phcontent_0_phcontentsections_0_ctl02_pnlInfo"
        ],
        "https://www.cnv.org/Parks-Recreation/Annual-Events/Harbour-Beach": [
          "#phcontent_0_phcontentsections_0_ctl06_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Parks-Recreation/Events/Event-Booking-Guide": [
          "#phcontent_0_phcontentsections_0_ctl05_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Parks-Recreation/Public-Spaces": [
          "#phcontent_0_phcontentsections_0_ctl02_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Streets-Transportation/Parking/Accessible-Parking": [
          "#phcontent_0_phcontentsections_0_ctl02_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Streets-Transportation/Parking/Parking-Rules-and-Regulations": [
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Streets-Transportation/Parking/Pay-Parking": [
          "#phcontent_0_phcontentsections_0_ctl06_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Streets-Transportation/Streets-Sidewalks/Boulevards/Landscape-Encroachments": [
          "#phcontent_0_phcontentsections_0_ctl02_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Streets-Transportation/Streets-Sidewalks/Roadwork": [
          "#phcontent_0_phcontentsections_0_ctl02_pnlInfo > div:nth-child(2) > table.noZebraStripes",
          "#phcontent_0_phcontentsections_0_ctl02_pnlInfo > div:nth-child(2) > table.table"
        ],
        "https://www.cnv.org/Streets-Transportation/Traffic/Trucks": [
          "#phcontent_0_phcontentsections_0_ctl05_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Streets-Transportation/Transportation-Planning/North-Shore-Transportation-Survey": [
          "#phcontent_0_phcontentsections_0_ctl02_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Streets-Transportation/Transportation-Projects/Past-Projects/Low-Level-Road-Project": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table"
        ]
      }
    },
    {
      "name": "cards-feature",
      "instances": [
        ".content-section > div.featureCTAs",
        ".content-section > div.featureListings",
        "[id$='_pnlFeatureListingInfo']",
        ".infoPanel div.featureListingsThreeColumn"
      ],
      "pageInstances": {
        "https://www.cnv.org/Business-Development": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlFeatureListingInfo"
        ],
        "https://www.cnv.org/Business-Development/Building": [
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > div > div.featureListingsThreeColumn",
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > div > div.row"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Development-Permits": [
          "#phcontent_0_phcontentsections_0_ctl06_pnlFeatureListing",
          "#phcontent_0_phcontentsections_0_ctl07_pnlFeatureListing"
        ],
        "https://www.cnv.org/Business-Development/Economic-Development/Invest": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlFeatureListing"
        ],
        "https://www.cnv.org/Business-Development/Filming-In-the-City": [
          "#phcontent_0_phcontentsections_0_ctl04_pnlFeatureListing"
        ],
        "https://www.cnv.org/Business-Development/Filming-In-the-City/Filming-Locations": [
          "#phcontent_0_phcontentsections_0_ctl05_pnlFeatureListing > div:nth-child(1)",
          "#phcontent_0_phcontentsections_0_ctl05_pnlFeatureListing > div:nth-child(2)"
        ],
        "https://www.cnv.org/City-Hall": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlFeatureListingInfo"
        ],
        "https://www.cnv.org/City-Hall/About": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlFeatureListing > div:nth-child(1)",
          "#phcontent_0_phcontentsections_0_ctl03_pnlFeatureListing > div:nth-child(2)",
          "#phcontent_0_phcontentsections_0_ctl03_pnlFeatureListing > div:nth-child(3)"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/Harry-Jerome-Community-Recreation-Centre": [
          "#phcontent_0_phcontentsections_0_ctl11_pnlFeatureListing > div:nth-child(1)",
          "#phcontent_0_phcontentsections_0_ctl11_pnlFeatureListing > div:nth-child(2)"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/Harry-Jerome-Community-Recreation-Centre/News-and-Updates": [
          "#phcontent_0_phcontentsections_0_ctl06_pnlFeatureListing > div:nth-child(1)",
          "#phcontent_0_phcontentsections_0_ctl06_pnlFeatureListing > div:nth-child(2)",
          "#phcontent_0_phcontentsections_0_ctl06_pnlFeatureListing > div:nth-child(3)"
        ],
        "https://www.cnv.org/City-Hall/Careers": [
          "#phcontent_0_phcontentsections_0_ctl08_pnlFeatureListing"
        ],
        "https://www.cnv.org/City-Hall/Claims-and-Causes-of-Loss": [
          "#phcontent_0_phcontentsections_0_ctl04_pnlFeatureListing"
        ],
        "https://www.cnv.org/City-Hall/Committees": [
          "#phcontent_0_phcontentsections_0_ctl07_pnlFeatureListing > div:nth-child(1)",
          "#phcontent_0_phcontentsections_0_ctl07_pnlFeatureListing > div:nth-child(2)",
          "#phcontent_0_phcontentsections_0_ctl07_pnlFeatureListing > div:nth-child(3)",
          "#phcontent_0_phcontentsections_0_ctl07_pnlFeatureListing > div:nth-child(4)"
        ],
        "https://www.cnv.org/City-Hall/General-Local-Election": [
          "#phcontent_0_phcontentsections_0_ctl05_pnlFeatureListing"
        ],
        "https://www.cnv.org/Community-Environment": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlFeatureListingInfo"
        ],
        "https://www.cnv.org/Community-Environment/Climate-Action": [
          "#phcontent_0_phcontentsections_0_ctl04_pnlFeatureListing"
        ],
        "https://www.cnv.org/Community-Environment/Energy": [
          "#phcontent_0_phcontentsections_0_ctl04_pnlFeatureListing"
        ],
        "https://www.cnv.org/Community-Environment/Help-Environment": [
          "#phcontent_0_phcontentsections_0_ctl04_pnlFeatureListing > div:nth-child(1)",
          "#phcontent_0_phcontentsections_0_ctl04_pnlFeatureListing > div:nth-child(2)"
        ],
        "https://www.cnv.org/Community-Environment/Help-Environment/Community-Cleanup": [
          "#phcontent_0_phcontentsections_0_ctl08_pnlFeatureListing",
          "#phcontent_0_phcontentsections_0_ctl09_pnlFeatureListing"
        ],
        "https://www.cnv.org/Community-Environment/Housing": [
          "#phcontent_0_phcontentsections_0_ctl04_pnlFeatureListing"
        ],
        "https://www.cnv.org/Community-Environment/Housing/Provincial-Housing-Legislation-Updates": [
          "#phcontent_0_phcontentsections_0_ctl07_pnlFeatureListing > div:nth-child(1)",
          "#phcontent_0_phcontentsections_0_ctl07_pnlFeatureListing > div:nth-child(2)"
        ],
        "https://www.cnv.org/Community-Environment/Land-Use": [
          "#phcontent_0_phcontentsections_0_ctl05_pnlFeatureListing",
          "#phcontent_0_phcontentsections_0_ctl06_pnlFeatureListing"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Children-Youth-Families": [
          "#phcontent_0_phcontentsections_0_ctl04_pnlFeatureListing > div:nth-child(1)",
          "#phcontent_0_phcontentsections_0_ctl04_pnlFeatureListing > div:nth-child(2)"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Local-Food": [
          "#phcontent_0_phcontentsections_0_ctl08_pnlFeatureListing"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Youth/CNV4ME/How-Our-City-Works": [
          "#phcontent_0_phcontentsections_0_ctl05_pnlFeatureListing > div:nth-child(1)",
          "#phcontent_0_phcontentsections_0_ctl05_pnlFeatureListing > div:nth-child(2)",
          "#phcontent_0_phcontentsections_0_ctl05_pnlFeatureListing > div:nth-child(3)",
          "#phcontent_0_phcontentsections_0_ctl05_pnlFeatureListing > div:nth-child(4)",
          "#phcontent_0_phcontentsections_0_ctl05_pnlFeatureListing > div:nth-child(5)"
        ],
        "https://www.cnv.org/Community-Environment/Trees": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlFeatureListing > div:nth-child(1)",
          "#phcontent_0_phcontentsections_0_ctl03_pnlFeatureListing > div:nth-child(2)"
        ],
        "https://www.cnv.org/Home-Property": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlFeatureListingInfo"
        ],
        "https://www.cnv.org/Home-Property/Garbage-Recycling-Green-Can": [
          "#phcontent_0_phcontentsections_0_ctl05_pnlFeatureListing > div:nth-child(1)",
          "#phcontent_0_phcontentsections_0_ctl05_pnlFeatureListing > div:nth-child(2)"
        ],
        "https://www.cnv.org/Home-Property/Water-Sewer-Drainage/Drainage": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlFeatureListing"
        ],
        "https://www.cnv.org/Parks-Recreation": [
          "#phcontent_0_phcontentsections_0_pnlContentSection"
        ],
        "https://www.cnv.org/Parks-Recreation/Annual-Events": [
          "#phcontent_0_phcontentsections_0_ctl03_rptFeatures_pnlFirstItem_0",
          "#phcontent_0_phcontentsections_0_ctl03_rptFeatures_pnlSecondPanel_0",
          "#phcontent_0_phcontentsections_0_ctl03_rptFeatures_pnlFirstItem_1",
          "#phcontent_0_phcontentsections_0_ctl03_rptFeatures_pnlSecondPanel_1",
          "#phcontent_0_phcontentsections_0_ctl03_rptFeatures_pnlFirstItem_2",
          "#phcontent_0_phcontentsections_0_ctl03_rptFeatures_pnlSecondPanel_2",
          "#phcontent_0_phcontentsections_0_ctl03_rptFeatures_pnlFirstItem_3"
        ],
        "https://www.cnv.org/Parks-Recreation/Annual-Events/Long-Summer-Nights": [
          "#phcontent_0_phcontentsections_0_ctl07_pnlFeatureListing > div:nth-child(1)",
          "#phcontent_0_phcontentsections_0_ctl07_pnlFeatureListing > div:nth-child(2)"
        ],
        "https://www.cnv.org/Parks-Recreation/Annual-Events/Lunchtime-Live": [
          "#phcontent_0_phcontentsections_0_ctl05_pnlFeatureListing > div:nth-child(1)",
          "#phcontent_0_phcontentsections_0_ctl05_pnlFeatureListing > div:nth-child(2)",
          "#phcontent_0_phcontentsections_0_ctl05_pnlFeatureListing > div:nth-child(3)"
        ],
        "https://www.cnv.org/Parks-Recreation/Annual-Events/Public-Works-Open-House": [
          "#phcontent_0_phcontentsections_0_ctl06_pnlFeatureListing > div:nth-child(1)",
          "#phcontent_0_phcontentsections_0_ctl06_pnlFeatureListing > div:nth-child(2)"
        ],
        "https://www.cnv.org/Parks-Recreation/Annual-Events/Spirit-of-the-Season": [
          "#phcontent_0_phcontentsections_0_ctl07_pnlFeatureListing > div:nth-child(1)",
          "#phcontent_0_phcontentsections_0_ctl07_pnlFeatureListing > div:nth-child(2)"
        ],
        "https://www.cnv.org/Parks-Recreation/Arts-Culture": [
          "#phcontent_0_phcontentsections_0_ctl06_pnlFeatureListing > div:nth-child(1)",
          "#phcontent_0_phcontentsections_0_ctl06_pnlFeatureListing > div:nth-child(2)"
        ],
        "https://www.cnv.org/Parks-Recreation/Events": [
          "#phcontent_0_phcontentsections_0_ctl06_pnlFeatureListing"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlFeatureListing > div:nth-child(1)",
          "#phcontent_0_phcontentsections_0_ctl03_pnlFeatureListing > div:nth-child(2)"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Greenways": [
          "#phcontent_0_phcontentsections_0_ctl04_pnlFeatureListing",
          "#phcontent_0_phcontentsections_0_ctl05_pnlFeatureListing"
        ],
        "https://www.cnv.org/Parks-Recreation/Play-CNV": [
          "#phcontent_0_phcontentsections_0_ctl10_pnlFeatureListing"
        ],
        "https://www.cnv.org/Parks-Recreation/The-Shipyards": [
          "#phcontent_0_phcontentsections_0_ctl08_pnlFeatureListing"
        ],
        "https://www.cnv.org/Streets-Transportation": [
          "#phcontent_0_phcontentsections_0_ctl04_pnlFeatureListingInfo"
        ],
        "https://www.cnv.org/Streets-Transportation/Parking": [
          "#phcontent_0_phcontentsections_0_ctl03_rptFeatures_pnlFirstItem_0",
          "#phcontent_0_phcontentsections_0_ctl03_rptFeatures_pnlSecondPanel_0",
          "#phcontent_0_phcontentsections_0_ctl03_rptFeatures_pnlFirstItem_1",
          "#phcontent_0_phcontentsections_0_ctl03_rptFeatures_pnlSecondPanel_1"
        ],
        "https://www.cnv.org/Streets-Transportation/Traffic/Electric-Vehicles/How-to-Use-the-Charging-Stations": [
          "#phcontent_0_phcontentsections_0_ctl06_pnlFeatureListing"
        ],
        "https://www.cnv.org/Streets-Transportation/Travel-Options/Cycling": [
          "#phcontent_0_phcontentsections_0_ctl05_pnlFeatureListing > div:nth-child(1)",
          "#phcontent_0_phcontentsections_0_ctl05_pnlFeatureListing > div:nth-child(2)"
        ]
      }
    },
    {
      "name": "cards-teaser",
      "instances": [
        ".content-section > div.featureRowsListing"
      ],
      "pageInstances": {
        "https://www.cnv.org/Business-Development/Building/Energy-Efficient-Buildings-Initiative": [
          "#phcontent_0_phcontentsections_0_ctl03_rptFeatures_pnlFirstItem_0",
          "#phcontent_0_phcontentsections_0_ctl03_rptFeatures_pnlSecondPanel_0"
        ],
        "https://www.cnv.org/Business-Development/Business-Licences/Outdoor-Dining": [
          "#phcontent_0_phcontentsections_0_ctl05_pnlFeatureRowsListing > div:nth-child(1)",
          "#phcontent_0_phcontentsections_0_ctl05_pnlFeatureRowsListing > div:nth-child(2)"
        ],
        "https://www.cnv.org/Business-Development/Economic-Development": [
          "#phcontent_0_phcontentsections_0_ctl03_rptFeatures_pnlFirstItem_0",
          "#phcontent_0_phcontentsections_0_ctl03_rptFeatures_pnlSecondPanel_0",
          "#phcontent_0_phcontentsections_0_ctl03_rptFeatures_pnlFirstItem_1",
          "#phcontent_0_phcontentsections_0_ctl03_rptFeatures_pnlSecondPanel_1"
        ],
        "https://www.cnv.org/Business-Development/Filming-In-the-City/Filming-Locations": [
          "#phcontent_0_phcontentsections_0_ctl06_pnlFeatureRowsListing > div:nth-child(1)",
          "#phcontent_0_phcontentsections_0_ctl06_pnlFeatureRowsListing > div:nth-child(2)"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlFeatureRowsListing > div:nth-child(1)",
          "#phcontent_0_phcontentsections_0_ctl03_pnlFeatureRowsListing > div:nth-child(2)"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/Harry-Jerome-Neighbourhood-Lands": [
          "#phcontent_0_phcontentsections_0_ctl02_pnlInfo > div:nth-child(2) > div"
        ],
        "https://www.cnv.org/Community-Environment/Environmental-Protection/Waste": [
          "#content-columns > div > div.content.layout-columns"
        ],
        "https://www.cnv.org/Community-Environment/Land-Use/Density-Bonusing": [
          "#phcontent_0_phcontentsections_0_ctl05_rptFeatures_pnlFirstItem_0",
          "#phcontent_0_phcontentsections_0_ctl05_rptFeatures_pnlSecondPanel_0",
          "#phcontent_0_phcontentsections_0_ctl05_rptFeatures_pnlFirstItem_1",
          "#phcontent_0_phcontentsections_0_ctl05_rptFeatures_pnlSecondPanel_1"
        ],
        "https://www.cnv.org/Home-Property/Water-Sewer-Drainage/Drainage/Stormwater-Management-Plan-Requirements-for-New-Development": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlFeatureRowsListing > div:nth-child(1)",
          "#phcontent_0_phcontentsections_0_ctl03_pnlFeatureRowsListing > div:nth-child(2)",
          "#phcontent_0_phcontentsections_0_ctl03_pnlFeatureRowsListing > div:nth-child(3)",
          "#phcontent_0_phcontentsections_0_ctl03_pnlFeatureRowsListing > div:nth-child(4)"
        ],
        "https://www.cnv.org/Parks-Recreation/Annual-Events/Markets-in-the-City": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlFeatureRowsListing > div:nth-child(1)",
          "#phcontent_0_phcontentsections_0_ctl03_pnlFeatureRowsListing > div:nth-child(2)",
          "#phcontent_0_phcontentsections_0_ctl03_pnlFeatureRowsListing > div:nth-child(3)"
        ],
        "https://www.cnv.org/Parks-Recreation/Arts-Culture": [
          "#phcontent_0_phcontentsections_0_ctl05_pnlFeatureListing"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Park-Projects/Past-Projects": [
          "#content-columns > div > div.content.layout-columns"
        ],
        "https://www.cnv.org/Parks-Recreation/Public-Spaces": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlFeatureRowsListing > div:nth-child(1)",
          "#phcontent_0_phcontentsections_0_ctl03_pnlFeatureRowsListing > div:nth-child(2)",
          "#phcontent_0_phcontentsections_0_ctl03_pnlFeatureRowsListing > div:nth-child(3)",
          "#phcontent_0_phcontentsections_0_ctl03_pnlFeatureRowsListing > div:nth-child(4)",
          "#phcontent_0_phcontentsections_0_ctl03_pnlFeatureRowsListing > div:nth-child(5)",
          "#phcontent_0_phcontentsections_0_ctl03_pnlFeatureRowsListing > div:nth-child(6)",
          "#phcontent_0_phcontentsections_0_ctl03_pnlFeatureRowsListing > div:nth-child(7)"
        ],
        "https://www.cnv.org/Streets-Transportation/Traffic/Electric-Vehicles/Incentive-Programs": [
          "#phcontent_0_phcontentsections_0_ctl07_pnlFeatureRowsListing > div:nth-child(1)",
          "#phcontent_0_phcontentsections_0_ctl07_pnlFeatureRowsListing > div:nth-child(2)",
          "#phcontent_0_phcontentsections_0_ctl07_pnlFeatureRowsListing > div:nth-child(3)",
          "#phcontent_0_phcontentsections_0_ctl09_pnlFeatureRowsListing"
        ],
        "https://www.cnv.org/Streets-Transportation/Transportation-Projects": [
          "#phcontent_0_phcontentsections_0_ctl04_pnlFeatureRowsListing"
        ],
        "https://www.cnv.org/Streets-Transportation/Travel-Options/Cycling/Bikeway-Types": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlFeatureRowsListing > div:nth-child(1)",
          "#phcontent_0_phcontentsections_0_ctl03_pnlFeatureRowsListing > div:nth-child(2)",
          "#phcontent_0_phcontentsections_0_ctl03_pnlFeatureRowsListing > div:nth-child(3)",
          "#phcontent_0_phcontentsections_0_ctl03_pnlFeatureRowsListing > div:nth-child(4)",
          "#phcontent_0_phcontentsections_0_ctl03_pnlFeatureRowsListing > div:nth-child(5)",
          "#phcontent_0_phcontentsections_0_ctl03_pnlFeatureRowsListing > div:nth-child(6)"
        ]
      }
    },
    {
      "name": "columns-related-links",
      "instances": [
        "div.resources-documents:has(> [id$='_pnlRight'])"
      ],
      "pageInstances": {
        "https://www.cnv.org/Business-Development/Building/Energy-Efficient-Buildings-Initiative/New-Buildings": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlResources"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Zoning": [
          "#phcontent_0_phcontentsections_0_ctl09_pnlResources"
        ],
        "https://www.cnv.org/Business-Development/Business-Licences/Food-Trucks": [
          "#phcontent_0_phcontentsections_0_ctl12_pnlResources"
        ],
        "https://www.cnv.org/Business-Development/Business-Licences/Recreational-Cannabis-Retail": [
          "#phcontent_0_phcontentsections_0_ctl09_pnlResources"
        ],
        "https://www.cnv.org/Business-Development/Business-Licences/Short-Term-Rentals": [
          "#phcontent_0_phcontentsections_0_ctl11_pnlResources"
        ],
        "https://www.cnv.org/Business-Development/Economic-Development/Invest/Resources-and-Support": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlResources"
        ],
        "https://www.cnv.org/City-Hall/Bylaws/Noise-Control": [
          "#phcontent_0_phcontentsections_0_ctl09_pnlResources"
        ],
        "https://www.cnv.org/City-Hall/Committees/Heritage-Advisory-Committee": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlResources"
        ],
        "https://www.cnv.org/City-Hall/Committees/North-Vancouver-Policing-Committee": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlResources"
        ],
        "https://www.cnv.org/City-Hall/Community-Engagement": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlResources"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings": [
          "#phcontent_0_phcontentsections_0_ctl09_pnlResources"
        ],
        "https://www.cnv.org/City-Hall/Finances/Annual-Municipal-Report": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlResources"
        ],
        "https://www.cnv.org/Community-Environment/Climate-Action": [
          "#phcontent_0_phcontentsections_0_ctl05_pnlResources"
        ],
        "https://www.cnv.org/Community-Environment/Climate-Action/Climate-Change-Adaptation": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlResources"
        ],
        "https://www.cnv.org/Community-Environment/Energy/Jump-on-a-New-Heat-Pump-New": [
          "#phcontent_0_phcontentsections_0_ctl09_pnlResources"
        ],
        "https://www.cnv.org/Community-Environment/Environmental-Protection/Invasive-Species/European-Fire-Ant": [
          "#phcontent_0_phcontentsections_0_ctl07_pnlResources"
        ],
        "https://www.cnv.org/Community-Environment/Environmental-Protection/Rain-Drains-Creeks/Stormwater-Management-Overview": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlResources"
        ],
        "https://www.cnv.org/Community-Environment/Housing/Provincial-Housing-Legislation-Updates/Bill-25,-c-,-Response-to-provincial-requirements": [
          "#phcontent_0_phcontentsections_0_ctl07_pnlResources"
        ],
        "https://www.cnv.org/Community-Environment/Housing/Rental-Housing": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlResources"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Accessibility": [
          "#phcontent_0_phcontentsections_0_ctl07_pnlResources"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Youth/Youth-Awards-Scholarships/Civic-Youth-Awards": [
          "#phcontent_0_phcontentsections_0_ctl09_pnlResources"
        ],
        "https://www.cnv.org/Parks-Recreation/Events/Event-Booking-Guide": [
          "#phcontent_0_phcontentsections_0_ctl09_pnlResources"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Planning-Rules/Dogs": [
          "#phcontent_0_phcontentsections_0_ctl05_pnlResources"
        ],
        "https://www.cnv.org/Streets-Transportation/Transportation-Planning/Walk-CNV": [
          "#phcontent_0_phcontentsections_0_ctl09_pnlResources"
        ],
        "https://www.cnv.org/Streets-Transportation/Travel-Options/Cycling": [
          "#phcontent_0_phcontentsections_0_ctl07_pnlResources"
        ],
        "https://www.cnv.org/Streets-Transportation/Travel-Options/Safe-and-Active-School-Travel-Program": [
          "#phcontent_0_phcontentsections_0_ctl11_pnlResources"
        ]
      }
    },
    {
      "name": "embed-video",
      "instances": [
        ".infoPanel div.iframeWrapper"
      ],
      "pageInstances": {
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/115-East-Keith-Road": [
          "#fxb_c02f9068-fd48-4979-84d7-34434ac27917_Fields_033122c2-3048-4fd7-8f52-e9c56e86dc73__CaptchaValue_wrapper"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/222-East-2nd-Street": [
          "#fxb_51094ee2-1070-440d-a3ef-a92e41f19b1f_Fields_60dd0f59-e2b7-472f-b5b1-bff4fa525692__CaptchaValue_wrapper"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/412-East-5th-Street": [
          "#fxb_c5380e79-6099-4892-8f1f-3f61fd7bc232_Fields_bb6bbef4-016e-451a-bed2-822eb952e26d__CaptchaValue_wrapper"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/509-East-6th-Street": [
          "#fxb_ac17a1c7-e654-4236-9566-d5bc08525895_Fields_311d0d3b-10d2-4416-9802-cb9058441029__CaptchaValue_wrapper"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/541-West-Keith-Road": [
          "#fxb_46586a3e-8f29-4d6a-b60a-8e9a29470ceb_Fields_1663f69a-d1d4-42af-a078-504c007f8e68__CaptchaValue_wrapper"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/648-West-14th-Street": [
          "#fxb_437c5a27-869e-4ddd-af28-b7a5f81325a1_Fields_56130ccc-040f-4dc4-9f7e-ee4b4df101fd__CaptchaValue_wrapper"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/835---845-West-15th-Street": [
          "#fxb_23b843a7-e4d3-4293-8039-cb52043c4f85_Fields_d6dad377-9ebf-49c6-96f4-068253b51709__CaptchaValue_wrapper"
        ],
        "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/971-West-1st-Street": [
          "#fxb_2c2e68d2-295a-4da2-bdc0-f25c80a3e0da_Fields_9c7758b7-e74b-49a9-ae52-400b016afc4e__CaptchaValue_wrapper"
        ],
        "https://www.cnv.org/Business-Development/Building/Subdivisions": [
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > div.iframeWrapper"
        ],
        "https://www.cnv.org/Business-Development/Filming-In-the-City/Filming-Locations/Filming-at-The-Shipyards": [
          "#phcontent_0_phcontentsections_0_ctl18_pnlInfo > div:nth-child(2) > div"
        ],
        "https://www.cnv.org/Calendar-of-Events": [
          "#monthlistSpudDiv",
          "#tabchooserSpudDiv",
          "#mainSpudDiv"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/Harbour-Deck": [
          "#phcontent_0_phcontentsections_0_ctl08_pnlInfo > div:nth-child(2) > div"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/Harry-Jerome-Community-Recreation-Centre": [
          "#phcontent_0_phcontentsections_0_ctl12_pnlInfo > div:nth-child(2) > div"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/Harry-Jerome-Community-Recreation-Centre/About-the-Centre": [
          "#phcontent_0_phcontentsections_0_ctl19_pnlInfo > div:nth-child(2) > div"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/Harry-Jerome-Community-Recreation-Centre/Construction": [
          "#phcontent_0_phcontentsections_0_ctl08_pnlInfo"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings": [
          "#monthlistSpudDiv",
          "#tabchooserSpudDiv",
          "#mainSpudDiv"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Minutes-Archive": [
          "#phcontent_0_phcontentsections_0_pnlContentSection"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Videos/2003-Council-Videos": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > div"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Videos/2004-Council-Videos": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > div"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Videos/2005-Council-Videos": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > div"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Videos/2006-Council-Videos": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > div"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Videos/2007-Council-Videos": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > div"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Videos/2008-Council-Videos": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > div"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Videos/2009-Council-Videos": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > div"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Videos/2010-Council-Videos": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > div"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Videos/2011-Council-Videos": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > div"
        ],
        "https://www.cnv.org/City-Hall/Online-Services/CityServe": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > div.iframeWrapper"
        ],
        "https://www.cnv.org/Comments": [
          "#fxb_c4328c26-3f75-475c-acdd-a346b0c3407a_Fields_4d7a143e-382e-4068-af5a-915ba43f6532__CaptchaValue_wrapper"
        ],
        "https://www.cnv.org/Community-Environment/Environmental-Protection/Waste/On-Street-Recycling": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > div"
        ],
        "https://www.cnv.org/Community-Environment/Housing/Affordable-Housing": [
          "#phcontent_0_phcontentsections_0_ctl06_pnlInfo > div:nth-child(2) > div"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Local-Food/Community-Gardens": [
          "#phcontent_0_phcontentsections_0_ctl02_pnlInfo > div:nth-child(2) > div"
        ],
        "https://www.cnv.org/Home-Property/Fire-Department/FireSmart": [
          "#phcontent_0_phcontentsections_0_ctl07_pnlInfo > div:nth-child(2) > p:nth-child(3)"
        ],
        "https://www.cnv.org/Home-Property/Garbage-Recycling-Green-Can/Dog-Waste-Program": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > p:nth-child(4) > div"
        ],
        "https://www.cnv.org/Parks-Recreation/Annual-Events/Spirit-of-the-Season": [
          "#phcontent_0_phcontentsections_0_ctl08_pnlInfo > div:nth-child(2) > p"
        ],
        "https://www.cnv.org/Parks-Recreation/Arts-Culture/Public-Art": [
          "#phcontent_0_phcontentsections_0_ctl07_pnlInfo > div:nth-child(2) > p > div"
        ],
        "https://www.cnv.org/Parks-Recreation/Events": [
          "#monthlistSpudDiv",
          "#tabchooserSpudDiv",
          "#mainSpudDiv"
        ],
        "https://www.cnv.org/Parks-Recreation/Events/Submit-Event": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo"
        ],
        "https://www.cnv.org/Parks-Recreation/Parks-Greenways/Parks": [
          "#phcontent_0_phcontentsections_0_ctl08_pnlInfo > div:nth-child(2) > div"
        ],
        "https://www.cnv.org/Parks-Recreation/The-Shipyards": [
          "#monthlistSpudDiv",
          "#tabchooserSpudDiv",
          "#mainSpudDiv"
        ],
        "https://www.cnv.org/Parks-Recreation/The-Shipyards/About-The-Shipyards": [
          "#phcontent_0_phcontentsections_0_ctl05_pnlInfo > div:nth-child(2) > p:nth-child(4)",
          "#phcontent_0_phcontentsections_0_ctl08_pnlInfo > div:nth-child(2) > div:nth-child(2)"
        ],
        "https://www.cnv.org/Parks-Recreation/The-Shipyards/Splash-Park": [
          "#phcontent_0_phcontentsections_0_ctl07_pnlInfo > div:nth-child(2) > div"
        ],
        "https://www.cnv.org/Streets-Transportation/Parking/Accessible-Parking": [
          "#phcontent_0_phcontentsections_0_ctl02_pnlInfo > div:nth-child(2) > p:nth-child(12)"
        ],
        "https://www.cnv.org/Streets-Transportation/Parking/Curb-Access-,-a-,amp;-Parking-Plan": [
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > p:nth-child(16)"
        ],
        "https://www.cnv.org/Streets-Transportation/Parking/Pay-Parking": [
          "#phcontent_0_phcontentsections_0_ctl06_pnlInfo > div:nth-child(2) > p:nth-child(10)"
        ],
        "https://www.cnv.org/Streets-Transportation/Parking/Resident-and-Visitor-Parking": [
          "#phcontent_0_phcontentsections_0_ctl06_pnlInfo > div:nth-child(2) > p:nth-child(4)"
        ],
        "https://www.cnv.org/Streets-Transportation/Streets-Sidewalks/Roadwork": [
          "#phcontent_0_phcontentsections_0_ctl02_pnlInfo > div:nth-child(2) > div"
        ],
        "https://www.cnv.org/Streets-Transportation/Traffic/Ride-Hailing-,-a-,amp;-Taxis": [
          "#phcontent_0_phcontentsections_0_ctl07_pnlInfo > div:nth-child(2) > p:nth-child(4)"
        ],
        "https://www.cnv.org/Streets-Transportation/Transportation-Planning/Mobility-Network": [
          "#phcontent_0_phcontentsections_0_ctl04_pnlInfo > div:nth-child(2) > div.map-container"
        ],
        "https://www.cnv.org/Streets-Transportation/Transportation-Projects/Past-Projects/St-Andrews-Safety-Improvements": [
          "#phcontent_0_phcontentsections_0_ctl02_pnlInfo > div:nth-child(2) > p:nth-child(14) > div"
        ],
        "https://www.cnv.org/Streets-Transportation/Travel-Options/Look-Think-Go/Elephant-s-Feet": [
          "#phcontent_0_phcontentsections_0_ctl06_pnlInfo > div:nth-child(2) > p:nth-child(5)"
        ]
      }
    },
    {
      "name": "columns-feature",
      "instances": [
        ".content-section > div.call-out-5050-anchor"
      ],
      "pageInstances": {
        "https://www.cnv.org/Business-Development/Filming-In-the-City/Filming-Locations/Filming-at-The-Shipyards": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div:nth-child(2)",
          "#phcontent_0_phcontentsections_0_pnlContentSection > div:nth-child(3)",
          "#phcontent_0_phcontentsections_0_pnlContentSection > div:nth-child(4)",
          "#phcontent_0_phcontentsections_0_pnlContentSection > div:nth-child(5)",
          "#phcontent_0_phcontentsections_0_pnlContentSection > div:nth-child(6)",
          "#phcontent_0_phcontentsections_0_pnlContentSection > div:nth-child(7)"
        ],
        "https://www.cnv.org/City-Hall/About/Capital-Projects/Harry-Jerome-Community-Recreation-Centre/About-the-Centre": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div:nth-child(2)",
          "#phcontent_0_phcontentsections_0_pnlContentSection > div:nth-child(3)",
          "#phcontent_0_phcontentsections_0_pnlContentSection > div:nth-child(4)",
          "#phcontent_0_phcontentsections_0_pnlContentSection > div:nth-child(5)",
          "#phcontent_0_phcontentsections_0_pnlContentSection > div:nth-child(6)",
          "#phcontent_0_phcontentsections_0_pnlContentSection > div:nth-child(7)",
          "#phcontent_0_phcontentsections_0_pnlContentSection > div:nth-child(8)"
        ],
        "https://www.cnv.org/City-Hall/Mayor-Council/Mayor-Linda-Buchanan/Community-Updates": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div:nth-child(2)",
          "#phcontent_0_phcontentsections_0_pnlContentSection > div:nth-child(3)",
          "#phcontent_0_phcontentsections_0_pnlContentSection > div:nth-child(4)"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Child-Care": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-5050-anchor"
        ],
        "https://www.cnv.org/Community-Environment/Social-Planning/Youth/Studio-in-the-City": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div:nth-child(2)",
          "#phcontent_0_phcontentsections_0_pnlContentSection > div:nth-child(3)",
          "#phcontent_0_phcontentsections_0_pnlContentSection > div:nth-child(4)",
          "#phcontent_0_phcontentsections_0_pnlContentSection > div:nth-child(5)",
          "#phcontent_0_phcontentsections_0_pnlContentSection > div:nth-child(6)",
          "#phcontent_0_phcontentsections_0_pnlContentSection > div:nth-child(7)",
          "#phcontent_0_phcontentsections_0_pnlContentSection > div:nth-child(8)",
          "#phcontent_0_phcontentsections_0_pnlContentSection > div:nth-child(9)",
          "#phcontent_0_phcontentsections_0_pnlContentSection > div:nth-child(10)"
        ],
        "https://www.cnv.org/Parks-Recreation/Play-CNV": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-5050-anchor"
        ],
        "https://www.cnv.org/Streets-Transportation/Transportation-Planning/Walk-CNV": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-5050-anchor"
        ]
      }
    },
    {
      "name": "columns",
      "instances": [
        ".infoPanel table.columns-layout"
      ],
      "pageInstances": {
        "https://www.cnv.org/Business-Development/Filming-In-the-City/Filming-Locations/Filming-in-City-Hall": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table:nth-child(12)"
        ],
        "https://www.cnv.org/City-Hall/Mayor-Council/Mayor-Linda-Buchanan": [
          "#phcontent_0_phcontentsections_0_ctl07_pnlInfo"
        ],
        "https://www.cnv.org/Community-Environment/Environmental-Protection/Invasive-Species/Chafer-Beetle": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ]
      }
    },
    {
      "name": "search-keyword",
      "instances": [
        "[id$='_phSearchArea']",
        ".importedBylaws > .greyBackground"
      ],
      "pageInstances": {
        "https://www.cnv.org/City-Hall/Bylaws": [
          "#page-content > div:nth-child(2) > div.importedBylaws > div.greyBackground > button",
          "#page-content > div:nth-child(2) > div.importedBylaws > div.greyBackground > div:nth-child(6)"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2012-Meetings": [
          "#phcontent_0_phgeneralpagecontent_0_phSearchArea"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2013-Meetings": [
          "#phcontent_0_phgeneralpagecontent_0_phSearchArea"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2014-Meetings": [
          "#phcontent_0_phgeneralpagecontent_0_phSearchArea"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2015-Meetings": [
          "#phcontent_0_phgeneralpagecontent_0_phSearchArea"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2016-Meetings": [
          "#phcontent_0_phgeneralpagecontent_0_phSearchArea"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2017-Meetings": [
          "#phcontent_0_phgeneralpagecontent_0_phSearchArea"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2018-Meetings": [
          "#phcontent_0_phgeneralpagecontent_0_phSearchArea"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2019-Meetings": [
          "#phcontent_0_phgeneralpagecontent_0_phSearchArea"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2020-Meetings": [
          "#phcontent_0_phgeneralpagecontent_0_phSearchArea"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2021-Meetings": [
          "#phcontent_0_phgeneralpagecontent_0_phSearchArea"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2022-Meetings": [
          "#phcontent_0_phgeneralpagecontent_0_phSearchArea"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2023-Meetings": [
          "#phcontent_0_phgeneralpagecontent_0_phSearchArea"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2024-Meetings": [
          "#phcontent_0_phgeneralpagecontent_0_phSearchArea"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2025-Meetings": [
          "#phcontent_0_phgeneralpagecontent_0_phSearchArea"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Council-Agendas,-Minutes-and-Videos/2026-Meetings": [
          "#phcontent_0_phgeneralpagecontent_0_phSearchArea"
        ],
        "https://www.cnv.org/City-Hall/News-Room/CityConnect-Subscription": [
          "#mc_embed_signup_scroll > div.mc-field-group.input-group > ul"
        ],
        "https://www.cnv.org/City-Hall/News-Room/CityView-eNewsletter-Subscribe": [
          "#mc_embed_signup_scroll > div.mc-field-group.input-group > ul"
        ],
        "https://www.cnv.org/Home-Property/Garbage-Recycling-Green-Can/Curbside-Collection": [
          "#rCpage-place_calendar > div > div > div > div > div"
        ],
        "https://www.cnv.org/Home-Property/Garbage-Recycling-Green-Can/Recycling": [
          "#rCpage-wizard_search > div.page-section.no-title > div > div > div > div"
        ]
      }
    },
    {
      "name": "title-bar",
      "instances": [
        ".widget-box > .widget-header"
      ],
      "pageInstances": {
        "https://www.cnv.org/Home-Property/Garbage-Recycling-Green-Can/Curbside-Collection": [
          "#rCw > div.widget-box > div.widget-header"
        ],
        "https://www.cnv.org/Home-Property/Garbage-Recycling-Green-Can/Recycling": [
          "#rCw > div.widget-box > div.widget-header"
        ]
      }
    },
    {
      "name": "tabs-tools",
      "instances": [
        ".widget-box > .widget-body > .widget-tablist-region"
      ],
      "pageInstances": {
        "https://www.cnv.org/Home-Property/Garbage-Recycling-Green-Can/Curbside-Collection": [
          "#rCw > div.widget-box > div.widget-body > div.widget-tablist-region"
        ]
      }
    },
    {
      "name": "cards-icon",
      "instances": [
        ".popularSearches > div"
      ],
      "pageInstances": {
        "https://www.cnv.org/Home-Property/Garbage-Recycling-Green-Can/Recycling": [
          "#rCpage-wizard_search > div.popularSearches.page-section > div"
        ]
      }
    }
  ],
  "sections": [
    {
      "id": "hero-banner",
      "name": "Hero banner",
      "selector": [
        "#top-banner"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": [
        "#top-banner"
      ]
    },
    {
      "id": "breadcrumb",
      "name": "Breadcrumb",
      "selector": [
        "#breadcrumbs-navigation"
      ],
      "style": null,
      "blocks": [
        "breadcrumb"
      ],
      "defaultContent": []
    },
    {
      "id": "main-content",
      "name": "Sidebar navigation and main content",
      "selector": [
        "#content-columns > div.container > div.content.layout-columns",
        "#content-columns .layout-columns"
      ],
      "style": null,
      "blocks": [
        "form",
        "cards-gallery",
        "video-date-select",
        "listing-filter",
        "notice",
        "table-data",
        "cards-feature",
        "cards-teaser",
        "columns-related-links",
        "embed-video",
        "columns-feature",
        "columns",
        "search-keyword",
        "title-bar",
        "tabs-tools",
        "cards-icon"
      ],
      "defaultContent": [
        "#left-side-navigation .navigation-title",
        "#left-side-navigation-items-deep",
        "#page-content-section > h1",
        ".infoPanel > div > h2",
        ".infoPanel > div > h3",
        ".infoPanel > div > h4",
        ".infoPanel > div > p",
        ".infoPanel > div > ul",
        ".infoPanel > div > ol",
        ".infoPanel > div > img",
        ".infoPanel > div > a",
        "div.resources-documents",
        "div.mobile-accordion",
        "#widgets .widgets-section"
      ]
    }
  ],
  "pageCleanup": {
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/115-East-Keith-Road": [
      "html > body:nth-child(2) > div:nth-child(12)"
    ],
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/222-East-2nd-Street": [
      "html > body:nth-child(2) > div:nth-child(15)"
    ],
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/412-East-5th-Street": [
      "html > body:nth-child(2) > div:nth-child(15)"
    ],
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/509-East-6th-Street": [
      "html > body:nth-child(2) > div:nth-child(12)"
    ],
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/541-West-Keith-Road": [
      "html > body:nth-child(2) > div:nth-child(15)"
    ],
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/648-West-14th-Street": [
      "html > body:nth-child(2) > div:nth-child(12)"
    ],
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/835---845-West-15th-Street": [
      "html > body:nth-child(2) > div:nth-child(12)"
    ],
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/971-West-1st-Street": [
      "html > body:nth-child(2) > div:nth-child(15)"
    ],
    "https://www.cnv.org/Comments": [
      "html > body:nth-child(2) > div:nth-child(6)"
    ]
  }
};

const parsers = {
  'breadcrumb': breadcrumbParser,
  'form': formParser,
  'cards-gallery': cardsGalleryParser,
  'video-date-select': videoDateSelectParser,
  'listing-filter': listingFilterParser,
  'notice': noticeParser,
  'table-data': tableDataParser,
  'cards-feature': cardsFeatureParser,
  'cards-teaser': cardsTeaserParser,
  'columns-related-links': columnsRelatedLinksParser,
  'embed-video': embedVideoParser,
  'columns-feature': columnsFeatureParser,
  'columns': columnsParser,
  'search-keyword': searchKeywordParser,
  'title-bar': titleBarParser,
  'tabs-tools': tabsToolsParser,
  'cards-icon': cardsIconParser,
};
// Late transformers change the DOM (section <hr> markers, shared fragments), so their beforeTransform
// runs after block discovery.
const sectionTransformers = [cnvSectionsTransformer];
const fragmentTransformers = [];
const lateTransformers = [...sectionTransformers, ...fragmentTransformers];
const transformers = [cnvCleanupTransformer, ...lateTransformers];
const earlyTransformers = transformers.filter((fn) => !lateTransformers.includes(fn));
// Catalog selectors (pageInstances, pageCleanup) count the <script> and <hr> elements the importer
// removes before transform, so a catalog template finds its targets in preprocess.
const CATALOG = Boolean(PAGE_TEMPLATE.pageCleanup || PAGE_TEMPLATE.blocks.some((b) => b.pageInstances));

function executeTransformers(hookName, element, payload, list = transformers) {
  const enhancedPayload = { ...payload, template: payload.params?.targets?.template || PAGE_TEMPLATE };
  list.forEach((fn) => {
    try { fn(hookName, element, enhancedPayload); }
    catch (e) { console.error(`Transformer failed at ${hookName}:`, e); }
  });
}

function findBlocksOnPage(document, template, url) {
  const pageBlocks = [];
  const pageKey = (u) => {
    try { const { origin, pathname } = new URL(u); return `${origin}${pathname.replace(/\/$/, '')}`; }
    catch { return u; }
  };
  const key = pageKey(url);
  const claim = (blockDef, selector) => {
    let matches = [];
    try { matches = document.querySelectorAll(selector); } catch { return; }
    matches.forEach((element) => {
      if (pageBlocks.some((b) => b.element === element || b.element.contains(element) || element.contains(b.element))) return;
      pageBlocks.push({ name: blockDef.name, selector, element });
    });
  };
  template.blocks.forEach((blockDef) => {
    const entry = Object.entries(blockDef.pageInstances || {}).find(([u]) => pageKey(u) === key);
    (entry ? entry[1] : []).forEach((selector) => claim(blockDef, selector));
  });
  template.blocks.forEach((blockDef) => (blockDef.instances || []).forEach((selector) => claim(blockDef, selector)));
  return pageBlocks;
}

// Runs the early transformers, then marks each block and section target with an attribute: the
// importer re-creates the body before transform, so only attributes survive, not element references.
function markPageTargets(payload) {
  const { document, params } = payload;
  executeTransformers('beforeTransform', document.body, payload, earlyTransformers);
  const blocks = findBlocksOnPage(document, PAGE_TEMPLATE, params.originalURL).map(({ name, selector, element }, i) => {
    element.setAttribute('data-excat-block', String(i));
    return { name, selector };
  });
  const sections = (PAGE_TEMPLATE.sections || []).map((section, i) => {
    const target = (section.selector || []).map((s) => { try { return document.querySelector(s); } catch { return null; } }).find(Boolean);
    if (!target) return section;
    target.setAttribute('data-excat-section', String(i));
    return { ...section, selector: [`[data-excat-section="${i}"]`] };
  });
  params.targets = { blocks, template: { ...PAGE_TEMPLATE, sections } };
}

export default {
  preprocess: (payload) => {
    if (CATALOG) markPageTargets(payload);
  },
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;
    params.fragments = [];

    if (!params.targets) markPageTargets(payload);
    const pageBlocks = params.targets.blocks
      .map((block, i) => ({ ...block, element: document.querySelector(`[data-excat-block="${i}"]`) }))
      .filter((block) => block.element);
    executeTransformers('beforeTransform', main, { ...payload, pageBlocks }, lateTransformers);

    pageBlocks.forEach((block) => {
      if (!main.contains(block.element)) return;
      const parser = parsers[block.name];
      if (!parser) return;
      try { parser(block.element, { document, url, params }); }
      catch (e) { console.error(`Failed to parse ${block.name} (${block.selector}):`, e); }
    });

    executeTransformers('afterTransform', main, payload);

    main.appendChild(document.createElement('hr'));
    WebImporter.rules.createMetadata(main, document);
    // extra page metadata set by transformers (e.g. template: news); keys must match the
    // page-metadata model field names exactly (md2jcr is case-sensitive)
    const metaTable = [...main.querySelectorAll('table')]
      .find((t) => /^metadata$/i.test((t.rows[0]?.textContent || '').trim()));
    Object.entries(params.extraMetadata || {}).forEach(([key, value]) => {
      if (!metaTable) return;
      const existing = [...metaTable.rows]
        .find((r) => (r.cells[0]?.textContent || '').trim().toLowerCase() === key.toLowerCase());
      if (existing && existing.cells[1]) {
        existing.cells[1].textContent = value;
        return;
      }
      const tr = document.createElement('tr');
      [key, value].forEach((v) => {
        const td = document.createElement('td');
        td.textContent = v;
        tr.append(td);
      });
      (metaTable.tBodies[0] || metaTable).append(tr);
    });
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // A fragment's nodes left `main` before afterTransform: finalize it the same way, without the
    // page-only section breaks and metadata.
    params.fragments.forEach(({ element }) => {
      executeTransformers('afterTransform', element, payload, earlyTransformers);
      WebImporter.rules.transformBackgroundImages(element, document);
      WebImporter.rules.adjustImageUrls(element, url, params.originalURL);
    });

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) },
    }, ...params.fragments];
  },
};
