import { ReactNode } from 'react';

export interface Service {
  id: string;
  title: string;
  description: string;
  tag: string;
  iconName: string; // lucide icon name
  image: string;
}

export interface Popup {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  isActive: boolean;
  link?: string;
}

export interface PricingItem {
  dist: string;
  price: string;
  type: string;
}

export interface Step {
  id: string;
  title: string;
  desc: string;
}

export interface PricingCondition {
  title: string;
  description: string;
}

export interface CancellationItem {
  time: string;
  policy: string;
  color: string;
  bg: string;
}

export interface AppContent {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroImage?: string;
  services: Service[];
  popups: Popup[];
  // New CMS fields
  contactPhone: string;
  contactAddress: string;
  businessNumber: string;
  pricingTable: PricingItem[];
  footerText: string;
  footerDescription?: string;
  footerLogoText?: string;
  footerSubText?: string;
  servicePartner?: string;
  // New title fields for CMS
  servicesTitle?: string;
  pricingTitle?: string;
  processTitle?: string;
  bannerTitle?: string;
  logoText?: string;
  logoImage?: string;
  // Expanded fields
  steps?: Step[];
  pricingConditions?: PricingCondition[];
  cancellationPolicy?: CancellationItem[];
  // Navigation & Button labels
  navConsignment?: string;
  navScrap?: string;
  navChauffeur?: string;
  navRecruitment?: string;
  navCustomerCenter?: string;
  heroConsignmentTitle?: string;
  heroConsignmentDesc?: string;
  heroScrapTitle?: string;
  heroScrapDesc?: string;
  heroChauffeurTitle?: string;
  heroChauffeurDesc?: string;
  // New fields for all pages
  // Consignment Page
  consignmentHeroTitle?: string;
  consignmentHeroSubtitle?: string;
  consignmentBadgeText?: string;
  consignmentFeaturesTitle?: string;
  consignmentProcessTitle?: string;
  consignmentBannerTitle?: string;
  consignmentBannerSubtitle?: string;
  consignmentExemptionClauses?: PricingCondition[];
  // Consignment Form Labels
  consignmentFormClientTitle?: string;
  consignmentFormVehicleTitle?: string;
  consignmentFormDepartureTitle?: string;
  consignmentFormDestinationTitle?: string;
  consignmentFormPaymentTitle?: string;
  consignmentFormNotesTitle?: string;
  consignmentFormTransmissionLabel?: string;
  consignmentFormStickLabel?: string;
  consignmentFormSiteContactLabel?: string;
  consignmentFormDepartureContactLabel?: string;
  consignmentFormDestinationContactLabel?: string;
  consignmentFormStartAddressLabel?: string;
  consignmentFormEndAddressLabel?: string;
  consignmentFormSubmitLabel?: string;
  consignmentFormHeroButtonLabel?: string;
  consignmentFormBannerButtonLabel?: string;

  // Chauffeur Page
  chauffeurHeroTitle?: string;
  chauffeurHeroSubtitle?: string;
  chauffeurBadgeText?: string;
  chauffeurFeaturesTitle?: string;
  chauffeurProcessTitle?: string;
  chauffeurBannerTitle?: string;
  chauffeurBannerSubtitle?: string;
  chauffeurPricingTitle?: string;
  chauffeurPricingTable?: PricingItem[];
  chauffeurPricingConditions?: PricingCondition[];
  chauffeurCancellationPolicy?: CancellationItem[];
  chauffeurExemptionClauses?: PricingCondition[];

  // Scrap Page
  scrapHeroTitle?: string;
  scrapHeroSubtitle?: string;
  scrapFormTitle?: string;
  scrapProcessTitle?: string;
  scrapGuideTitle?: string;
  scrapPriceTitle?: string;
  scrapBannerTitle?: string;
  scrapBannerSubtitle?: string;
  scrapLegalNotice?: PricingCondition[];
  scrapStrategicPoints?: PricingCondition[];

  // Recruitment Page
  recruitmentHeroTitle?: string;
  recruitmentHeroSubtitle?: string;
  recruitmentSupportTitle?: string;
  recruitmentGuideTitle?: string;
  recruitmentRentalTitle?: string;
  recruitmentBannerTitle?: string;
  recruitmentBannerSubtitle?: string;

  // Customer Center Page
  customerHeroTitle?: string;
  customerHeroSubtitle?: string;

  // Chauffeur Form Labels
  chauffeurFormClientTitle?: string;
  chauffeurFormDepartureTitle?: string;
  chauffeurFormDestinationTitle?: string;
  chauffeurFormPriceTitle?: string;
  chauffeurFormVehicleTitle?: string;
  chauffeurFormSubmitLabel?: string;
  chauffeurFormBannerButtonLabel?: string;

  // Footer Headers
  footerServiceTitle?: string;
  footerCustomerTitle?: string;
  footerCompanyTitle?: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}
