/* eslint-disable */
/* global WebImporter */

import breadcrumbParser from './parsers/breadcrumb.js';
import noticeParser from './parsers/notice.js';
import formParser from './parsers/form.js';
import embedVideoParser from './parsers/embed-video.js';
import videoDateSelectParser from './parsers/video-date-select.js';
import cnvCleanupTransformer from './transformers/cnv-cleanup.js';
import cnvSectionsTransformer from './transformers/cnv-sections.js';

const PAGE_TEMPLATE = {
  "name": "form-page-sidebar",
  "urls": [
    "https://www.cnv.org/City-Hall/Contact/Have-Your-Say",
    "https://www.cnv.org/City-Hall/Council-Meetings/Public-Hearings-and-Public-Meetings",
    "https://www.cnv.org/City-Hall/Council-Meetings/Public-Hearings-and-Public-Meetings/Public-Hearing-Sign-Up",
    "https://www.cnv.org/City-Hall/Council-Meetings/Public-Input-Period/Public-Input-Period-Registration",
    "https://www.cnv.org/City-Hall/Mayor-Council/Mayor-Linda-Buchanan/Invite-the-Mayor",
    "https://www.cnv.org/City-Hall/Mayor-Council/Mayor-Linda-Buchanan/Request-a-Certificate",
    "https://www.cnv.org/City-Hall/Online-Services/Service-Request",
    "https://www.cnv.org/Home-Property/Fire-Department/Community-Awareness-and-Public-Safety-Program",
    "https://www.cnv.org/Parks-Recreation/Public-Spaces/Musician",
    "https://www.cnv.org/Parks-Recreation/Public-Spaces/Venue-Booking-Application"
  ],
  "description": "Inner page with hero banner, breadcrumb, left section navigation plus promo panels in the sidebar, and a main column holding an input form with the footer contained inside the content column",
  "blocks": [
    {
      "name": "breadcrumb",
      "instances": [
        "#breadcrumbs-navigation"
      ],
      "pageInstances": {
        "https://www.cnv.org/City-Hall/Contact/Have-Your-Say": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Public-Hearings-and-Public-Meetings": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Public-Hearings-and-Public-Meetings/Public-Hearing-Sign-Up": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Public-Input-Period/Public-Input-Period-Registration": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Mayor-Council/Mayor-Linda-Buchanan/Invite-the-Mayor": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Mayor-Council/Mayor-Linda-Buchanan/Request-a-Certificate": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/City-Hall/Online-Services/Service-Request": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Home-Property/Fire-Department/Community-Awareness-and-Public-Safety-Program": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Public-Spaces/Musician": [
          "#breadcrumbs-navigation"
        ],
        "https://www.cnv.org/Parks-Recreation/Public-Spaces/Venue-Booking-Application": [
          "#breadcrumbs-navigation"
        ]
      }
    },
    {
      "name": "notice",
      "instances": [
        ".content-section > div.call-out-info.call-out-icon"
      ],
      "pageInstances": {
        "https://www.cnv.org/City-Hall/Contact/Have-Your-Say": [
          "#phcontent_0_phwidgetscontent_0_ctl02_pnlEventsWidget"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Public-Hearings-and-Public-Meetings": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ],
        "https://www.cnv.org/Home-Property/Fire-Department/Community-Awareness-and-Public-Safety-Program": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
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
        "https://www.cnv.org/City-Hall/Contact/Have-Your-Say": [
          "#fxb_92477ff1-94dd-4d28-b42c-faa6ccede87f_Fields_efb56978-577f-4d14-aa5f-0036341cfe29__Value",
          "#fxb_92477ff1-94dd-4d28-b42c-faa6ccede87f_Fields_fadd6c4c-c17d-405d-ae6a-236476c3c561__Value",
          "#fxb_92477ff1-94dd-4d28-b42c-faa6ccede87f_Fields_05355e33-356a-4bd0-94c2-e9fa48caa4b7__Value",
          "#fxb_92477ff1-94dd-4d28-b42c-faa6ccede87f_Fields_7ce7f01d-bd55-4dc5-b07f-fe603041cb48__Value",
          "#fxb_92477ff1-94dd-4d28-b42c-faa6ccede87f_Fields_913404aa-7d7e-4499-8caf-a4572252a361__Value",
          "#fxb_92477ff1-94dd-4d28-b42c-faa6ccede87f_1614d3bc-984a-42ef-9404-f0243f3e437d > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > input[type=submit]:nth-child(14)"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Public-Hearings-and-Public-Meetings": [
          "#fxb_8aada3dd-43da-4a14-a82a-017bfd8ac10f_Fields_0eec599e-1f35-446c-a7c6-0bd7aaf8c809__Value",
          "#fxb_8aada3dd-43da-4a14-a82a-017bfd8ac10f_Fields_23374727-6ccd-4174-8d41-4cc10c536508__Value",
          "#fxb_8aada3dd-43da-4a14-a82a-017bfd8ac10f_Fields_63f70f4d-b41a-4439-8ebf-cd23e5a435c0__Value",
          "#fxb_8aada3dd-43da-4a14-a82a-017bfd8ac10f_Fields_3a8872bf-13f2-4e32-aa63-7216d6eac160__Value",
          "#fxb_8aada3dd-43da-4a14-a82a-017bfd8ac10f_Fields_bfad372c-8d93-4d84-9c5f-acf99e176549__Value",
          "#fxb_8aada3dd-43da-4a14-a82a-017bfd8ac10f_Fields_9c98e7d3-d8d2-4176-a78c-d27e507f524b__Value",
          "#fxb_8aada3dd-43da-4a14-a82a-017bfd8ac10f_Fields_ca27eae2-be45-4d6c-8a83-06526b7a36e0__Value",
          "#fxb_8aada3dd-43da-4a14-a82a-017bfd8ac10f_Fields_6195c3d7-a148-4df2-b444-11414a8905dd__Value",
          "#fxb_8aada3dd-43da-4a14-a82a-017bfd8ac10f_0d8787b4-5cce-45b5-a1f4-7074afbbdb85 > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > input[type=submit]:nth-child(17)"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Public-Hearings-and-Public-Meetings/Public-Hearing-Sign-Up": [
          "#fxb_f36ce1c2-ad5b-47a1-acfb-60e2523f03b0_Fields_0eec599e-1f35-446c-a7c6-0bd7aaf8c809__Value",
          "#fxb_f36ce1c2-ad5b-47a1-acfb-60e2523f03b0_Fields_23374727-6ccd-4174-8d41-4cc10c536508__Value",
          "#fxb_f36ce1c2-ad5b-47a1-acfb-60e2523f03b0_Fields_63f70f4d-b41a-4439-8ebf-cd23e5a435c0__Value",
          "#fxb_f36ce1c2-ad5b-47a1-acfb-60e2523f03b0_Fields_3a8872bf-13f2-4e32-aa63-7216d6eac160__Value",
          "#fxb_f36ce1c2-ad5b-47a1-acfb-60e2523f03b0_Fields_bfad372c-8d93-4d84-9c5f-acf99e176549__Value",
          "#fxb_f36ce1c2-ad5b-47a1-acfb-60e2523f03b0_Fields_9c98e7d3-d8d2-4176-a78c-d27e507f524b__Value",
          "#fxb_f36ce1c2-ad5b-47a1-acfb-60e2523f03b0_Fields_ca27eae2-be45-4d6c-8a83-06526b7a36e0__Value",
          "#fxb_f36ce1c2-ad5b-47a1-acfb-60e2523f03b0_Fields_6195c3d7-a148-4df2-b444-11414a8905dd__Value",
          "#fxb_f36ce1c2-ad5b-47a1-acfb-60e2523f03b0_0d8787b4-5cce-45b5-a1f4-7074afbbdb85 > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > input[type=submit]:nth-child(17)"
        ],
        "https://www.cnv.org/City-Hall/Council-Meetings/Public-Input-Period/Public-Input-Period-Registration": [
          "#fxb_ddd624dd-8357-4262-807e-1d0a885974d5_Fields_5075b8a7-4751-4188-8ad5-3a73f415f46a__Value",
          "#fxb_ddd624dd-8357-4262-807e-1d0a885974d5_Fields_da013ca2-a60c-4b09-83ee-66e9e9b73875__Value",
          "#fxb_ddd624dd-8357-4262-807e-1d0a885974d5_Fields_24c668cf-0ad3-4de2-88b9-5d2fa39ce020__Value",
          "#fxb_ddd624dd-8357-4262-807e-1d0a885974d5_Fields_1b860325-f86c-4bc7-bf2a-8ef449bb622a__Value",
          "#fxb_ddd624dd-8357-4262-807e-1d0a885974d5_Fields_65d3cacc-34d0-4aca-8755-2e3803e47f13__Value",
          "#fxb_ddd624dd-8357-4262-807e-1d0a885974d5_Fields_03d31fb4-3cf5-4f35-8ce3-5ec402cc1058__Value",
          "#fxb_ddd624dd-8357-4262-807e-1d0a885974d5_Fields_e2ee9e9d-eb86-4915-8711-e492a261b7e5__Value",
          "#fxb_ddd624dd-8357-4262-807e-1d0a885974d5_Fields_3e1e4b5e-c5ab-4c83-91d3-67d562f83570__Value",
          "#fxb_ddd624dd-8357-4262-807e-1d0a885974d5_Fields_346906c7-8b1a-4818-bd31-ac5d4d0a2405__Value",
          "#fxb_ddd624dd-8357-4262-807e-1d0a885974d5_Fields_d518b99a-e49c-4a85-a449-b2bff4d8fb38__Value",
          "#fxb_ddd624dd-8357-4262-807e-1d0a885974d5_03a3bf74-1e87-45bc-9f5b-9d515e31b05a > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > input[type=submit]:nth-child(14)"
        ],
        "https://www.cnv.org/City-Hall/Mayor-Council/Mayor-Linda-Buchanan/Invite-the-Mayor": [
          "#fxb_e7d63624-ff7a-4a6e-b8f5-ddca4c5a7033_Fields_a5e56ccd-ab96-43da-befe-9762f53cca61__Value",
          "#fxb_e7d63624-ff7a-4a6e-b8f5-ddca4c5a7033_Fields_ce3c5a71-0d8c-41f5-968c-7a5784df97d3__Value",
          "#fxb_e7d63624-ff7a-4a6e-b8f5-ddca4c5a7033_Fields_2b7b6f94-c9a7-4212-8246-3d552f5c46b8__Value",
          "#fxb_e7d63624-ff7a-4a6e-b8f5-ddca4c5a7033_Fields_27389893-f540-4776-9b5c-1384a3efcad3__Value",
          "#fxb_e7d63624-ff7a-4a6e-b8f5-ddca4c5a7033_Fields_69c72009-fcd3-47ce-a61e-aaea6c5bd18a__Value",
          "#fxb_e7d63624-ff7a-4a6e-b8f5-ddca4c5a7033_Fields_9591a971-ea9d-469d-ad32-61923229a9cf__Value",
          "#fxb_e7d63624-ff7a-4a6e-b8f5-ddca4c5a7033_Fields_6543dc4e-fc29-4da7-9c2f-0ab284a0dd6c__Value",
          "#fxb_e7d63624-ff7a-4a6e-b8f5-ddca4c5a7033_Fields_903d75b4-7d8a-4ee0-abdf-52d266e65ea2__Value",
          "#fxb_e7d63624-ff7a-4a6e-b8f5-ddca4c5a7033_Fields_1702233d-4e01-4d80-9088-be33b0c73d99__Value",
          "#fxb_e7d63624-ff7a-4a6e-b8f5-ddca4c5a7033_Fields_ea91410f-e0ef-4015-bdc9-1bde5cf8bd52__Value",
          "#fxb_e7d63624-ff7a-4a6e-b8f5-ddca4c5a7033_Fields_257d84e0-4370-4314-a293-64db62f7a592__Value",
          "#fxb_e7d63624-ff7a-4a6e-b8f5-ddca4c5a7033_Fields_383729a6-4235-4889-b31d-f6ed039bca70__Value",
          "#fxb_e7d63624-ff7a-4a6e-b8f5-ddca4c5a7033_5c1ff12c-0091-467a-9928-b6f446414e4c > div > div > div > div > div > div > div:nth-child(4) > div.input-wrapper.input-text > div:nth-child(4) > div > div:nth-child(4) > div > div > div > div > div:nth-child(6) > label:nth-child(2)",
          "#fxb_e7d63624-ff7a-4a6e-b8f5-ddca4c5a7033_5c1ff12c-0091-467a-9928-b6f446414e4c > div > div > div > div > div > div > div:nth-child(4) > div.input-wrapper.input-text > div:nth-child(4) > div > div:nth-child(4) > div > div > div > div > div:nth-child(6) > label:nth-child(3)",
          "#fxb_e7d63624-ff7a-4a6e-b8f5-ddca4c5a7033_5c1ff12c-0091-467a-9928-b6f446414e4c > div > div > div > div > div > div > div:nth-child(4) > div.input-wrapper.input-text > div:nth-child(4) > div > div:nth-child(4) > div > div > div > div > div:nth-child(9) > label:nth-child(2)",
          "#fxb_e7d63624-ff7a-4a6e-b8f5-ddca4c5a7033_5c1ff12c-0091-467a-9928-b6f446414e4c > div > div > div > div > div > div > div:nth-child(4) > div.input-wrapper.input-text > div:nth-child(4) > div > div:nth-child(4) > div > div > div > div > div:nth-child(9) > label:nth-child(3)",
          "#fxb_e7d63624-ff7a-4a6e-b8f5-ddca4c5a7033_Fields_c3dac9e0-34b5-4903-8c46-4ae4ddc5ce6e__Value",
          "#fxb_e7d63624-ff7a-4a6e-b8f5-ddca4c5a7033_5c1ff12c-0091-467a-9928-b6f446414e4c > div > div > div > div > div > div > div:nth-child(4) > div.input-wrapper.input-text > div:nth-child(4) > div > div:nth-child(4) > div > div > div > div > input[type=submit]:nth-child(21)"
        ],
        "https://www.cnv.org/City-Hall/Mayor-Council/Mayor-Linda-Buchanan/Request-a-Certificate": [
          "#fxb_403c5c83-944f-40d1-81cd-0a293c8a9ac6_Fields_dab36164-f7a1-4378-8028-1d184afc3266__Value",
          "#fxb_403c5c83-944f-40d1-81cd-0a293c8a9ac6_Fields_b656ae99-f753-40f7-a215-a76a3d033fcc__Value",
          "#fxb_403c5c83-944f-40d1-81cd-0a293c8a9ac6_Fields_dce9464d-8b30-43fa-9558-829af70eda85__Value",
          "#fxb_403c5c83-944f-40d1-81cd-0a293c8a9ac6_Fields_f7707df3-af27-45e5-a51b-4984edccc3ee__Value",
          "#fxb_403c5c83-944f-40d1-81cd-0a293c8a9ac6_Fields_9786e8a2-03d9-455a-8a73-d9f1b9341f7b__Value",
          "#fxb_403c5c83-944f-40d1-81cd-0a293c8a9ac6_Fields_954c2c7f-bd2e-41a8-96dd-0e52dc73744f__Value",
          "#fxb_403c5c83-944f-40d1-81cd-0a293c8a9ac6_Fields_f4d4aac6-faca-4480-affc-c695340db411__Value",
          "#fxb_403c5c83-944f-40d1-81cd-0a293c8a9ac6_Fields_fefcdbd3-fc10-49aa-be98-85be5c1a1357__Value",
          "#fxb_403c5c83-944f-40d1-81cd-0a293c8a9ac6_Fields_4d3683b8-038a-49a5-8e96-b492222cfce0__Value",
          "#fxb_403c5c83-944f-40d1-81cd-0a293c8a9ac6_Fields_50ccf67d-0ed9-44d1-83be-8bb5426d8340__Value",
          "#fxb_403c5c83-944f-40d1-81cd-0a293c8a9ac6_0aad9b46-ec30-4fac-92d4-6d4cf134e08e > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > input[type=submit]:nth-child(8)"
        ],
        "https://www.cnv.org/City-Hall/Online-Services/Service-Request": [
          "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_13caab63-77fc-4534-b0b7-375ce7dcdbe0 > div.input-wrapper.input-radiolist > label:nth-child(2)",
          "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_13caab63-77fc-4534-b0b7-375ce7dcdbe0 > div.input-wrapper.input-radiolist > label:nth-child(3)",
          "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_13caab63-77fc-4534-b0b7-375ce7dcdbe0 > div.input-wrapper.input-radiolist > label:nth-child(4)",
          "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_13caab63-77fc-4534-b0b7-375ce7dcdbe0 > div.input-wrapper.input-radiolist > label:nth-child(5)",
          "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_13caab63-77fc-4534-b0b7-375ce7dcdbe0 > div.input-wrapper.input-radiolist > label:nth-child(6)",
          "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_13caab63-77fc-4534-b0b7-375ce7dcdbe0 > div.input-wrapper.input-radiolist > label:nth-child(7)",
          "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_13caab63-77fc-4534-b0b7-375ce7dcdbe0 > div.input-wrapper.input-radiolist > label:nth-child(8)",
          "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_13caab63-77fc-4534-b0b7-375ce7dcdbe0 > div.input-wrapper.input-radiolist > label:nth-child(9)",
          "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_13caab63-77fc-4534-b0b7-375ce7dcdbe0 > div.input-wrapper.input-radiolist > label:nth-child(10)",
          "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_13caab63-77fc-4534-b0b7-375ce7dcdbe0 > div.input-wrapper.input-radiolist > label:nth-child(11)",
          "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_13caab63-77fc-4534-b0b7-375ce7dcdbe0 > div.input-wrapper.input-radiolist > label:nth-child(12)",
          "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_Fields_21752b05-dc7a-401b-83c5-11d62a4c6f77__Value",
          "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_Fields_0197c3cc-7bf9-4b65-8b72-3318a375f059__Value",
          "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_Fields_e68b8277-39e2-44a1-b690-3f88a71e2574__Value",
          "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_Fields_618dc846-2158-4d45-8540-e2722c1bd947__Value",
          "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_Fields_ed9d413c-8553-4050-8ec3-d4359036290f__Value",
          "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_Fields_54b63997-fde2-4be5-a6bd-40d694ed3d87__Value",
          "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_Fields_4cbc7471-82b0-480e-ba97-eae8811b7770__Value",
          "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_13caab63-77fc-4534-b0b7-375ce7dcdbe0 > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div.input-wrapper.input-radiolist > label:nth-child(2)",
          "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_13caab63-77fc-4534-b0b7-375ce7dcdbe0 > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div.input-wrapper.input-radiolist > label:nth-child(3)",
          "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_13caab63-77fc-4534-b0b7-375ce7dcdbe0 > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > input[type=submit]:nth-child(18)"
        ],
        "https://www.cnv.org/Home-Property/Fire-Department/Community-Awareness-and-Public-Safety-Program": [
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_Fields_77d8932b-c075-4206-a77f-7d07ebba5a52__Value",
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_Fields_00735ba3-25a6-4ff1-910a-37b3fbf438b0__Value",
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_Fields_78d8969e-bdd1-4a7f-a2f9-0bd71598b0a9__Value",
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_Fields_1eb7d151-3465-4009-9d4c-bcde4765ddd4__Value",
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div:nth-child(9) > label:nth-child(2)",
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div:nth-child(9) > label:nth-child(3)",
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div:nth-child(13) > label:nth-child(2)",
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div:nth-child(13) > label:nth-child(3)",
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_Fields_7ea1e046-a01a-46f5-ab25-3ddd9a22eb5a__Value",
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_Fields_f71a1a33-d5a8-4180-b371-c77f2d6cab77__Value",
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div:nth-child(3) > label:nth-child(2)",
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div:nth-child(3) > label:nth-child(3)",
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div:nth-child(6) > label:nth-child(2)",
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div:nth-child(6) > label:nth-child(3)",
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_Fields_7a8939b4-57ff-4b68-aa4c-78ec65254416__Value",
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-radiolist > label:nth-child(2)",
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-radiolist > label:nth-child(3)",
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_Fields_93f41f89-7c10-4327-a829-09f577d5d5fd__Value",
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_Fields_99266eff-fbe5-468c-8477-df7ad67eb263__Value",
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-checkboxlist > label:nth-child(3)",
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-checkboxlist > label:nth-child(4)",
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-checkboxlist > label:nth-child(5)",
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-checkboxlist > label:nth-child(6)",
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-checkboxlist > label:nth-child(7)",
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-checkboxlist > label:nth-child(8)",
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-checkboxlist > label:nth-child(9)",
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-checkboxlist > label:nth-child(10)",
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div:nth-child(9) > label:nth-child(2)",
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div:nth-child(9) > label:nth-child(3)",
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div:nth-child(12) > label:nth-child(2)",
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div:nth-child(12) > label:nth-child(3)",
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div:nth-child(15) > label:nth-child(2)",
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div:nth-child(15) > label:nth-child(3)",
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div:nth-child(18) > label:nth-child(2)",
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div:nth-child(18) > label:nth-child(3)",
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div:nth-child(21) > label:nth-child(2)",
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div:nth-child(21) > label:nth-child(3)",
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_Fields_6f59002e-ac03-4556-83a5-389b43f31104__Value",
          "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > input[type=submit]:nth-child(32)"
        ],
        "https://www.cnv.org/Parks-Recreation/Public-Spaces/Musician": [
          "#fxb_edef53a0-f919-4532-90cb-9a2b17458597_Fields_1b57477b-5ef7-47cb-8495-7d50d6f9a2c2__Value",
          "#fxb_edef53a0-f919-4532-90cb-9a2b17458597_Fields_4078ba2e-cc76-4ed9-a89d-6690aca92619__Value",
          "#fxb_edef53a0-f919-4532-90cb-9a2b17458597_Fields_bc9eb17a-66e0-4050-99ed-8e7c36f408c2__Value",
          "#fxb_edef53a0-f919-4532-90cb-9a2b17458597_Fields_60d83127-a64b-47af-ae43-c48114cf7b46__Value",
          "#fxb_edef53a0-f919-4532-90cb-9a2b17458597_Fields_a5596847-f7b8-429b-a49a-c6f3c9e70132__Value",
          "#fxb_edef53a0-f919-4532-90cb-9a2b17458597_Fields_d28bc70c-96fd-4248-acbb-4fb9db26cc04__Value",
          "#fxb_edef53a0-f919-4532-90cb-9a2b17458597_Fields_c6c51ea2-a8c5-49d8-9828-68b991f29909__Value",
          "#fxb_edef53a0-f919-4532-90cb-9a2b17458597_Fields_14f9f43b-3ccb-48cf-b6f1-92ef26270e3b__Value",
          "#fxb_edef53a0-f919-4532-90cb-9a2b17458597_f3aa4dfa-9333-4756-b5bd-de2c24cafa5b > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > input[type=submit]:nth-child(8)"
        ],
        "https://www.cnv.org/Parks-Recreation/Public-Spaces/Venue-Booking-Application": [
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_0292be33-f7ea-4983-a63d-e90fd360afb8__Value",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_9a061395-2dc2-4370-8682-84d1fed8fe7e__Value",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_7861f8fa-c071-4032-8d4f-225228117c0d__Value",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_0b19fa7c-9b4a-4bc0-b79d-086ee20bc971__Value",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_2b251a11-de62-4b14-9d69-8ac6e3760ea3__Value",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_60bac1d1-fe88-4b99-a240-78f0ea9afd6a__Value",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_cb67e57e-0bcb-46a9-92fd-61a33ab2f3e8__Value",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_938b9ffe-4340-46e1-bd6f-ad73d0b4f875__Value",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_3107b0db-3428-4ac8-a8e1-95b4ecac0bf4__Value",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_675d633f-498e-485c-886f-26c7d7e21ac4__Value",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_d73d4c10-8387-48db-92cb-9ffa49395ae1__Value",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_a6866f7e-75da-4067-a8b4-f0a52070acad__Value",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_ebd5c282-6feb-4cfd-959a-ffc1739185aa__Value",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_6f61bf30-bc94-4085-879c-4e3330dc9363__Value",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_79ed7174-6d9b-44c0-a4b8-195fdd9013ec__Value",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_768aaaf8-0f7b-4951-bd99-12475a115b11__Value",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_466aee4b-c1d6-4216-834a-ff62409db2a7__Value",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_d7ce374a-9285-447c-9583-bd890268e464__Value",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_e6e1dd9a-fc0c-4694-8c4a-0df241c11e8c__Value",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_4d3cc011-2176-4d78-b2fd-0a40c9aa4ed9__Value",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(7) > label:nth-child(2)",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(7) > label:nth-child(3)",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_ecaa22b9-95c4-4b9e-bc7e-ce36904c8ab9__Value",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(13) > label:nth-child(2)",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(13) > label:nth-child(3)",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_f6e033c9-c845-42a3-9f03-7329203bd73a__Value",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(19) > label:nth-child(2)",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(19) > label:nth-child(3)",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_e1540fd7-b5f2-4511-a4db-da0a2d093d22__Value",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(25) > label:nth-child(2)",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(25) > label:nth-child(3)",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_101cbc38-5b01-4edf-ba30-83062fc08709__Value",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(31) > label:nth-child(2)",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(31) > label:nth-child(3)",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_f7d33e36-bac9-4bb7-9085-755c7dcd8b71__Value",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(37) > label:nth-child(2)",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(37) > label:nth-child(3)",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_111d7c42-4b91-48e7-8762-1d6ecf37d31e__Value",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(43) > label:nth-child(2)",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(43) > label:nth-child(3)",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_41786600-17ef-4981-8f23-105bd73cf0be__Value",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(49) > label:nth-child(2)",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(49) > label:nth-child(3)",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_511a14c5-5da3-485a-a00d-a3a0d3a09563__Value",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(56) > label.mf-lbl-radio",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_5d829124-7efa-467f-9fa5-c63b8b5878b3__Value",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(63) > label:nth-child(2)",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(63) > label:nth-child(3)",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(66) > label:nth-child(2)",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(66) > label:nth-child(3)",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(69) > label:nth-child(2)",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(69) > label:nth-child(3)",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(73) > label.mf-lbl-radio",
          "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > input[type=submit]:nth-child(81)"
        ]
      }
    },
    {
      "name": "embed-video",
      "instances": [
        ".infoPanel div.iframeWrapper"
      ]
    },
    {
      "name": "video-date-select",
      "instances": [
        "#page-content > div:has(> select[id$='_dwnVideos'])"
      ]
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
        "notice",
        "form",
        "embed-video",
        "video-date-select"
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
    "https://www.cnv.org/City-Hall/Contact/Have-Your-Say": [
      "html > body:nth-child(2) > div:nth-child(2)"
    ],
    "https://www.cnv.org/City-Hall/Council-Meetings/Public-Hearings-and-Public-Meetings": [
      "html > body:nth-child(2) > div:nth-child(5)"
    ],
    "https://www.cnv.org/City-Hall/Council-Meetings/Public-Hearings-and-Public-Meetings/Public-Hearing-Sign-Up": [
      "html > body:nth-child(2) > div:nth-child(5)"
    ],
    "https://www.cnv.org/City-Hall/Council-Meetings/Public-Input-Period/Public-Input-Period-Registration": [
      "html > body:nth-child(2) > div:nth-child(5)"
    ],
    "https://www.cnv.org/City-Hall/Mayor-Council/Mayor-Linda-Buchanan/Invite-the-Mayor": [
      "html > body:nth-child(2) > div:nth-child(5)"
    ],
    "https://www.cnv.org/City-Hall/Mayor-Council/Mayor-Linda-Buchanan/Request-a-Certificate": [
      "html > body:nth-child(2) > div:nth-child(5)"
    ],
    "https://www.cnv.org/City-Hall/Online-Services/Service-Request": [
      "html > body:nth-child(2) > div:nth-child(5)"
    ],
    "https://www.cnv.org/Home-Property/Fire-Department/Community-Awareness-and-Public-Safety-Program": [
      "html > body:nth-child(2) > div:nth-child(2)"
    ],
    "https://www.cnv.org/Parks-Recreation/Public-Spaces/Musician": [
      "html > body:nth-child(2) > div:nth-child(2)"
    ],
    "https://www.cnv.org/Parks-Recreation/Public-Spaces/Venue-Booking-Application": [
      "html > body:nth-child(2) > div:nth-child(2)"
    ]
  }
};

const parsers = {
  'breadcrumb': breadcrumbParser,
  'notice': noticeParser,
  'form': formParser,
  'embed-video': embedVideoParser,
  'video-date-select': videoDateSelectParser,
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
