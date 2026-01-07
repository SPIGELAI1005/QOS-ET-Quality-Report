export type LanguageKey = "en" | "de" | "it";

export interface Translations {
  common: {
    language: string;
    theme: string;
    role: string;
    dark: string;
    light: string;
    reader: string;
    editor: string;
    admin: string;
    cancel: string;
    continue: string;
    close: string;
    save: string;
    delete: string;
    edit: string;
    view: string;
    search: string;
    filter: string;
    clear: string;
    selectAll: string;
    clearSelection: string;
    noData: string;
    loading: string;
    error: string;
    success: string;
    month: string;
    year: string;
    from: string;
    to: string;
    date: string;
    select: string;
    months: string[];
    site: string;
    clickToShowAll: string;
    clickToFilterBy: string;
    resetToShowAll: string;
    resetFilter: string;
  };
  header: {
    title: string;
    reportDate: string;
  };
  sidebar: {
    dashboard: string;
    aiSummary: string;
    customerSupplierPerformance: string;
    customerPerformance: string;
    supplierPerformance: string;
    costPerformance: string;
    poorQualityCosts: string;
    warrantiesCosts: string;
    internalPerformance: string;
    ppapsOverview: string;
    deviationsOverview: string;
    auditManagement: string;
    uploadData: string;
    dataLineage: string;
    glossary: string;
  };
  dashboard: {
    title: string;
    customerPerformance: string;
    supplierPerformance: string;
    customerSupplierPerformance: string;
    showing12MonthLookback: string;
    ytdCustomerMetrics: string;
    ytdSupplierMetrics: string;
    customerComplaints: string;
    q1Notifications: string;
    customerDeliveries: string;
    partsShipped: string;
    customerPpm: string;
    partsPerMillion: string;
    supplierComplaints: string;
    q2Notifications: string;
    supplierDeliveries: string;
    partsReceived: string;
    supplierPpm: string;
    internalComplaints: string;
    q3Notifications: string;
    totalComplaints: string;
    totalDeliveries: string;
    totalPpm: string;
    costPerformance: string;
    internalPerformance: string;
    customerDefectiveParts: string;
    supplierDefectiveParts: string;
    q1Defective: string;
    q2Defective: string;
    resetToShowAll: string;
    exportToExcel: string;
    clickToGenerateSummary: string;
    customerPpmSiteContribution: string;
    supplierPpmSiteContribution: string;
    defectivePartsBySite: string;
    deliveriesBySite: string;
    siteContribution: string;
    allSites: string;
    ytdTotalNotificationsByMonth: string;
    ytdTotalDefectsByMonth: string;
    customerPpmTrend: string;
    supplierPpmTrend: string;
    monthlyTrend: string;
  };
  filterPanel: {
    plant: string;
    quickAccess: string;
    sapP01Sites: string;
    sapPS4Sites: string;
    axSites: string;
    automotiveSites: string;
    aftermarketSites: string;
    individualPlants: string;
    complaintTypes: string;
    customer: string;
    supplier: string;
    internal: string;
    notificationTypes: string;
    customerComplaints: string;
    supplierComplaints: string;
    internalComplaints: string;
    deviations: string;
    ppap: string;
    dateRange: string;
    fromDate: string;
    toDate: string;
    pickDate: string;
    clearAllFilters: string;
    noPlantsAvailable: string;
    uploadDataFirst: string;
  };
  upload: {
    title: string;
    description: string;
    uploadFiles: string;
    enterData: string;
    changeHistory: string;
    accessDenied: string;
    accessDeniedDescription: string;
    switchToEditor: string;
    backToDashboard: string;
    structuredUpload: string;
    structuredUploadDescription: string;
    exportExcel: string;
    complaintsTitle: string;
    complaintsHelp: string;
    deliveriesTitle: string;
    deliveriesHelp: string;
    ppapTitle: string;
    ppapHelp: string;
    deviationsTitle: string;
    deviationsHelp: string;
    auditTitle: string;
    auditHelp: string;
    plantsTitle: string;
    plantsHelp: string;
    uploadButton: string;
    uploading: string;
    filesSelected: string;
    uploadCompleted: string;
    uploadFailed: string;
    usedIn: string;
    recalculateKpis: string;
    recalculateKpisDescription: string;
    calculateKpis: string;
    latestKpiCalculation: string;
    complaints: string;
    deliveries: string;
    siteMonthKpis: string;
    openDashboard: string;
    manualDataEntry: string;
    manualDataEntryDescription: string;
    plant: string;
    cityLocation: string;
    month: string;
    customerComplaintsQ1: string;
    supplierComplaintsQ2: string;
    internalComplaintsQ3: string;
    customerDefectiveParts: string;
    supplierDefectiveParts: string;
    internalDefectiveParts: string;
    outboundDeliveries: string;
    inboundDeliveries: string;
    ppapsInProgress: string;
    ppapsCompleted: string;
    deviationsInProgress: string;
    deviationsCompleted: string;
    deviationsTotalNote: string;
    auditsInternalSystem: string;
    auditsCertification: string;
    auditsProcess: string;
    auditsProduct: string;
    poorQualityCosts: string;
    warrantyCosts: string;
    addEntry: string;
    plantMustBe3Digits: string;
    manualEntries: string;
    showingFirst10: string;
    historyTitle: string;
    historyDescription: string;
    noHistory: string;
    files: string;
    summary: string;
    notes: string;
  };
  roleAccess: {
    selectRole: string;
    chooseRole: string;
    switchRole: string;
    selectRoleDescription: string;
    requiresPassword: string;
    wrongPassword: string;
  };
  home: {
    title: string;
    subtitle: string;
    realTimePpmTracking: string;
    realTimePpmDescription: string;
    comprehensiveAnalysis: string;
    comprehensiveAnalysisDescription: string;
    aiPoweredInsights: string;
    aiPoweredInsightsDescription: string;
    qualityAssurance: string;
    qualityAssuranceDescription: string;
    generateReport: string;
    footerCopyright: string;
    qualityManagementSystem: string;
    login: string;
    loginDescription: string;
  };
  // Add more translation keys as needed for other pages
}

const translations: Record<LanguageKey, Translations> = {
  en: {
    common: {
      language: "Language",
      theme: "Theme",
      role: "Role",
      dark: "Dark",
      light: "Light",
      reader: "Reader",
      editor: "Editor",
      admin: "Admin",
      cancel: "Cancel",
      continue: "Continue",
      close: "Close",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      view: "View",
      search: "Search",
      filter: "Filter",
      clear: "Clear",
      selectAll: "Select All",
      clearSelection: "Clear Selection",
      noData: "No data available",
      loading: "Loading...",
      error: "Error",
      success: "Success",
      month: "Month",
      year: "Year",
      from: "From",
      to: "To",
      date: "Date",
      select: "Select",
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      site: "Site",
      clickToShowAll: "Click to show all plants",
      clickToFilterBy: "Click to filter by",
      resetToShowAll: "Reset to show all plants",
      resetFilter: "Reset Filter",
    },
    header: {
      title: "QOS ET Quality Report",
      reportDate: "December 2025",
    },
    sidebar: {
      dashboard: "QOS ET Dashboard",
      aiSummary: "AI Management Summary",
      customerSupplierPerformance: "Customer & Supplier Performance",
      customerPerformance: "Customer Performance",
      supplierPerformance: "Supplier Performance",
      costPerformance: "Cost Performance",
      poorQualityCosts: "Poor Quality Costs",
      warrantiesCosts: "Warranties Costs",
      internalPerformance: "Internal Performance",
      ppapsOverview: "PPAPs Overview",
      deviationsOverview: "Deviations Overview",
      auditManagement: "Audit Management",
      uploadData: "Upload Data",
      dataLineage: "Data Lineage",
      glossary: "FAQ & Glossary",
    },
    dashboard: {
      title: "QOS ET Dashboard YTD //",
      customerPerformance: "Customer Performance",
      supplierPerformance: "Supplier Performance",
      customerSupplierPerformance: "Customer + Supplier Performance • Cost Performance • Internal Performance",
      showing12MonthLookback: "Showing 12-month lookback from",
      ytdCustomerMetrics: "YTD Customer Metrics",
      ytdSupplierMetrics: "YTD Supplier Metrics",
      customerComplaints: "Customer Complaints",
      q1Notifications: "Q1 notifications",
      customerDeliveries: "Customer Deliveries",
      partsShipped: "Parts shipped",
      customerPpm: "Customer PPM",
      partsPerMillion: "Parts Per Million",
      supplierComplaints: "Supplier Complaints",
      q2Notifications: "Q2 notifications",
      supplierDeliveries: "Supplier Deliveries",
      partsReceived: "Parts received",
      supplierPpm: "Supplier PPM",
      internalComplaints: "Internal Complaints",
      q3Notifications: "Q3 notifications",
      totalComplaints: "Total Complaints",
      totalDeliveries: "Total Deliveries",
      totalPpm: "Total PPM",
      costPerformance: "Cost Performance",
      internalPerformance: "Internal Performance",
      customerDefectiveParts: "Customer Defective Parts",
      supplierDefectiveParts: "Supplier Defective Parts",
      q1Defective: "Q1 defective",
      q2Defective: "Q2 defective",
      resetToShowAll: "Reset to show all plants",
      exportToExcel: "Export to Excel",
      clickToGenerateSummary: "Click to generate summary",
      customerPpmSiteContribution: "Customer PPM - Site Contribution per Month",
      supplierPpmSiteContribution: "Supplier PPM - Site Contribution per Month",
      defectivePartsBySite: "Defective Parts by Site",
      deliveriesBySite: "Deliveries by Site",
      siteContribution: "(Site contribution)",
      allSites: "All Sites",
      ytdTotalNotificationsByMonth: "YTD Total Number of Notifications by Month and Plant",
      ytdTotalDefectsByMonth: "YTD Total Number of Defects by Month and Plant",
      customerPpmTrend: "Customer PPM Trend",
      supplierPpmTrend: "Supplier PPM Trend",
      monthlyTrend: "Monthly Trend",
    },
    filterPanel: {
      plant: "PLANT",
      quickAccess: "QUICK ACCESS",
      sapP01Sites: "SAP P01 Sites",
      sapPS4Sites: "SAP PS4 Sites",
      axSites: "AX Sites",
      automotiveSites: "Automotive Sites",
      aftermarketSites: "Aftermarket Sites",
      individualPlants: "Individual Plants",
      complaintTypes: "Complaint Types",
      customer: "Customer",
      supplier: "Supplier",
      internal: "Internal",
      notificationTypes: "Notification Types",
      customerComplaints: "Customer Complaints",
      supplierComplaints: "Supplier Complaints",
      internalComplaints: "Internal Complaints",
      deviations: "Deviations",
      ppap: "PPAP",
      dateRange: "Date Range",
      fromDate: "From Date",
      toDate: "To Date",
      pickDate: "Pick a date",
      clearAllFilters: "Clear All Filters",
      noPlantsAvailable: "No plants available.",
      uploadDataFirst: "Upload data first.",
    },
    roleAccess: {
      selectRole: "Select access role",
      chooseRole: "Choose your role to continue.",
      switchRole: "Switch role",
      selectRoleDescription: "Select a role. Editor/Admin require a password.",
      requiresPassword: "Enter password",
      wrongPassword: "Wrong password.",
    },
    home: {
      title: "Empowering Excellence Through",
      subtitle: "Data-Driven Quality Management",
      realTimePpmTracking: "Real-Time\nPPM Tracking",
      realTimePpmDescription: "Monitor Parts Per Million and defects related metrics across all sites with instant updates.",
      comprehensiveAnalysis: "Comprehensive\nAnalysis",
      comprehensiveAnalysisDescription: "Deep insights into customer, supplier, and internal quality performance.",
      aiPoweredInsights: "AI-Powered\nInsights",
      aiPoweredInsightsDescription: "Get actionable recommendations powered by advanced machine data interpretation.",
      qualityAssurance: "Quality\nAI-ssurance",
      qualityAssuranceDescription: "Comprehensive quality control and assurance across all operations using AI.",
      generateReport: "Generate QOS Report ET",
      footerCopyright: "© 2025 QOS ET Report. Driving Excellence in Operations and Quality.",
      qualityManagementSystem: "Quality Management System",
      login: "Log in",
      loginDescription: "Select your role to continue to the report.",
    },
    upload: {
      title: "Upload Data",
      description: "Structured upload + manual entry for the charts and KPI pages.",
      uploadFiles: "Upload Files",
      enterData: "Enter Data (Form)",
      changeHistory: "Change History",
      accessDenied: "Access denied",
      accessDeniedDescription: "Reader mode is read-only. Uploading files or entering data is restricted.",
      switchToEditor: "Please switch to Editor or Admin to upload or modify report data.",
      backToDashboard: "Back to Dashboard",
      structuredUpload: "Structured Upload",
      structuredUploadDescription: "Upload files by category so the correct pages/charts can be built reliably.",
      exportExcel: "Export (Excel)",
      complaintsTitle: "Customer & Supplier Complaints Files",
      complaintsHelp: "Upload complaint notifications (Q1/Q2/Q3). Multiple files supported.",
      deliveriesTitle: "Customer & Supplier Deliveries Files",
      deliveriesHelp: "Upload Outbound* (customer deliveries) and Inbound* (supplier deliveries). Multiple files supported.",
      ppapTitle: "PPAP Notification Files",
      ppapHelp: "Upload PPAP base + status extracts. Multiple files supported.",
      deviationsTitle: "Deviation Notifications Files",
      deviationsHelp: "Upload Deviations base + status extracts. Multiple files supported.",
      auditTitle: "Audit Management Files",
      auditHelp: "Upload audit source files (placeholder until parsing is implemented). Multiple files supported.",
      plantsTitle: "Plant Overview Files",
      plantsHelp: "Upload the official plants list (e.g. Webasto ET Plants .xlsx). Multiple files supported.",
      uploadButton: "Upload",
      uploading: "Uploading…",
      filesSelected: "file(s)",
      uploadCompleted: "Upload completed",
      uploadFailed: "Upload failed",
      usedIn: "Used in:",
      recalculateKpis: "Recalculate KPIs (Complaints + Deliveries)",
      recalculateKpisDescription: "When both categories are uploaded, compute KPIs and update the dashboard dataset.",
      calculateKpis: "Calculate KPIs",
      latestKpiCalculation: "Latest KPI Calculation",
      complaints: "Complaints:",
      deliveries: "Deliveries:",
      siteMonthKpis: "Site-month KPIs:",
      openDashboard: "Open QOS ET Dashboard",
      manualDataEntry: "Manual Data Entry (Template)",
      manualDataEntryDescription: "Enter monthly values per plant. These entries are persisted and merged into the local KPI dataset (`qos-et-kpis`).",
      plant: "Plant (3-digit)",
      cityLocation: "City/Location",
      month: "Month",
      customerComplaintsQ1: "Customer Complaints (Q1)",
      supplierComplaintsQ2: "Supplier Complaints (Q2)",
      internalComplaintsQ3: "Internal Complaints (Q3)",
      customerDefectiveParts: "Customer Defective Parts",
      supplierDefectiveParts: "Supplier Defective Parts",
      internalDefectiveParts: "Internal Defective Parts",
      outboundDeliveries: "Outbound Deliveries (Customer)",
      inboundDeliveries: "Inbound Deliveries (Supplier)",
      ppapsInProgress: "PPAPs In Progress",
      ppapsCompleted: "PPAPs Completed",
      deviationsInProgress: "Deviations In Progress",
      deviationsCompleted: "Deviations Completed",
      deviationsTotalNote: "Deviations total used by KPIs = In Progress + Completed.",
      auditsInternalSystem: "Audits: Internal System",
      auditsCertification: "Audits: Certification",
      auditsProcess: "Audits: Process",
      auditsProduct: "Audits: Product",
      poorQualityCosts: "Poor Quality Costs (template)",
      warrantyCosts: "Warranty Costs (template)",
      addEntry: "Add Entry",
      plantMustBe3Digits: "Plant must be a 3-digit code (e.g., 410).",
      manualEntries: "Manual Entries",
      showingFirst10: "Showing first 10 entries. Export to Excel to view all.",
      historyTitle: "Change History",
      historyDescription: "Every upload and manual entry is logged with timestamp, record counts, and usage references.",
      noHistory: "No history yet.",
      files: "Files:",
      summary: "Summary:",
      notes: "Notes:",
    },
  },
  de: {
    common: {
      language: "Sprache",
      theme: "Design",
      role: "Rolle",
      dark: "Dunkel",
      light: "Hell",
      reader: "Leser",
      editor: "Bearbeiter",
      admin: "Administrator",
      cancel: "Abbrechen",
      continue: "Weiter",
      close: "Schließen",
      save: "Speichern",
      delete: "Löschen",
      edit: "Bearbeiten",
      view: "Ansehen",
      search: "Suchen",
      filter: "Filter",
      clear: "Löschen",
      selectAll: "Alle auswählen",
      clearSelection: "Auswahl löschen",
      noData: "Keine Daten verfügbar",
      loading: "Lädt...",
      error: "Fehler",
      success: "Erfolg",
      month: "Monat",
      year: "Jahr",
      from: "Von",
      to: "Bis",
      date: "Datum",
      select: "Auswählen",
      months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
      site: "Werk",
      clickToShowAll: "Klicken, um alle Werke anzuzeigen",
      clickToFilterBy: "Klicken, um nach",
      resetToShowAll: "Zurücksetzen, um alle Werke anzuzeigen",
      resetFilter: "Filter zurücksetzen",
    },
    header: {
      title: "QOS ET Qualitätsbericht",
      reportDate: "Dezember 2025",
    },
    sidebar: {
      dashboard: "QOS ET Dashboard",
      aiSummary: "KI Management-Zusammenfassung",
      customerSupplierPerformance: "Kunden- & Lieferantenleistung",
      customerPerformance: "Kundenleistung",
      supplierPerformance: "Lieferantenleistung",
      costPerformance: "Kostenleistung",
      poorQualityCosts: "Mangelkosten",
      warrantiesCosts: "Garantiekosten",
      internalPerformance: "Interne Leistung",
      ppapsOverview: "PPAPs Übersicht",
      deviationsOverview: "Abweichungen Übersicht",
      auditManagement: "Audit Management",
      uploadData: "Daten hochladen",
      dataLineage: "Datenherkunft",
      glossary: "FAQ & Glossar",
    },
    dashboard: {
      title: "QOS ET Dashboard JTD //",
      customerPerformance: "Kundenleistung",
      supplierPerformance: "Lieferantenleistung",
      customerSupplierPerformance: "Kunden- + Lieferantenleistung • Kostenleistung • Interne Leistung",
      showing12MonthLookback: "12-Monats-Rückblick ab",
      ytdCustomerMetrics: "JTD Kundenmetriken",
      ytdSupplierMetrics: "JTD Lieferantenmetriken",
      customerComplaints: "Kundenreklamationen",
      q1Notifications: "Q1 Benachrichtigungen",
      customerDeliveries: "Kundenlieferungen",
      partsShipped: "Gelieferte Teile",
      customerPpm: "Kunden-PPM",
      partsPerMillion: "Teile pro Million",
      supplierComplaints: "Lieferantenreklamationen",
      q2Notifications: "Q2 Benachrichtigungen",
      supplierDeliveries: "Lieferanteneingänge",
      partsReceived: "Empfangene Teile",
      supplierPpm: "Lieferanten-PPM",
      internalComplaints: "Interne Reklamationen",
      q3Notifications: "Q3 Benachrichtigungen",
      totalComplaints: "Gesamtreklamationen",
      totalDeliveries: "Gesamtlieferungen",
      totalPpm: "Gesamt-PPM",
      costPerformance: "Kostenleistung",
      internalPerformance: "Interne Leistung",
      customerDefectiveParts: "Kundendefekteile",
      supplierDefectiveParts: "Lieferantendefekteile",
      q1Defective: "Q1 fehlerhaft",
      q2Defective: "Q2 fehlerhaft",
      resetToShowAll: "Zurücksetzen, um alle Werke anzuzeigen",
      exportToExcel: "Nach Excel exportieren",
      clickToGenerateSummary: "Klicken, um Zusammenfassung zu generieren",
      customerPpmSiteContribution: "Kunden-PPM - Werkbeitrag pro Monat",
      supplierPpmSiteContribution: "Lieferanten-PPM - Werkbeitrag pro Monat",
      defectivePartsBySite: "Defekteile nach Werk",
      deliveriesBySite: "Lieferungen nach Werk",
      siteContribution: "(Werkbeitrag)",
      allSites: "Alle Werke",
      ytdTotalNotificationsByMonth: "YTD Gesamtzahl Benachrichtigungen nach Monat und Werk",
      ytdTotalDefectsByMonth: "YTD Gesamtzahl Defekte nach Monat und Werk",
      customerPpmTrend: "Kunden-PPM Trend",
      supplierPpmTrend: "Lieferanten-PPM Trend",
      monthlyTrend: "Monatlicher Trend",
    },
    filterPanel: {
      plant: "WERK",
      quickAccess: "SCHNELLZUGRIFF",
      sapP01Sites: "SAP P01 Standorte",
      sapPS4Sites: "SAP PS4 Standorte",
      axSites: "AX Standorte",
      automotiveSites: "Automobilstandorte",
      aftermarketSites: "Aftermarket-Standorte",
      individualPlants: "Einzelne Werke",
      complaintTypes: "Reklamationstypen",
      customer: "Kunde",
      supplier: "Lieferant",
      internal: "Intern",
      notificationTypes: "Benachrichtigungstypen",
      customerComplaints: "Kundenreklamationen",
      supplierComplaints: "Lieferantenreklamationen",
      internalComplaints: "Interne Reklamationen",
      deviations: "Abweichungen",
      ppap: "PPAP",
      dateRange: "Zeitraum",
      fromDate: "Von Datum",
      toDate: "Bis Datum",
      pickDate: "Datum auswählen",
      clearAllFilters: "Alle Filter löschen",
      noPlantsAvailable: "Keine Werke verfügbar.",
      uploadDataFirst: "Bitte zuerst Daten hochladen.",
    },
    roleAccess: {
      selectRole: "Zugriffsrolle auswählen",
      chooseRole: "Wählen Sie Ihre Rolle, um fortzufahren.",
      switchRole: "Rolle wechseln",
      selectRoleDescription: "Wählen Sie eine Rolle. Bearbeiter/Administrator benötigen ein Passwort.",
      requiresPassword: "Passwort eingeben",
      wrongPassword: "Falsches Passwort.",
    },
    home: {
      title: "Exzellenz durch",
      subtitle: "Datengetriebenes Qualitätsmanagement",
      realTimePpmTracking: "Echtzeit\nPPM-Verfolgung",
      realTimePpmDescription: "Überwachen Sie Parts Per Million und fehlerbezogene Metriken an allen Standorten mit sofortigen Updates.",
      comprehensiveAnalysis: "Umfassende\nAnalyse",
      comprehensiveAnalysisDescription: "Tiefe Einblicke in Kunden-, Lieferanten- und interne Qualitätsleistung.",
      aiPoweredInsights: "KI-gestützte\nEinblicke",
      aiPoweredInsightsDescription: "Erhalten Sie umsetzbare Empfehlungen, die durch fortschrittliche Maschinendateninterpretation unterstützt werden.",
      qualityAssurance: "Qualitäts\nKI-sicherung",
      qualityAssuranceDescription: "Umfassende Qualitätskontrolle und -sicherung in allen Bereichen mit KI.",
      generateReport: "QOS ET Bericht erstellen",
      footerCopyright: "© 2025 QOS ET Report. Exzellenz in Betrieb und Qualität vorantreiben.",
      qualityManagementSystem: "Qualitätsmanagementsystem",
      login: "Anmelden",
      loginDescription: "Wählen Sie Ihre Rolle, um zum Bericht fortzufahren.",
    },
    upload: {
      title: "Daten hochladen",
      description: "Strukturierter Upload + manuelle Eingabe für Diagramme und KPI-Seiten.",
      uploadFiles: "Dateien hochladen",
      enterData: "Daten eingeben (Formular)",
      changeHistory: "Änderungsverlauf",
      accessDenied: "Zugriff verweigert",
      accessDeniedDescription: "Lesermodus ist schreibgeschützt. Das Hochladen von Dateien oder das Eingeben von Daten ist eingeschränkt.",
      switchToEditor: "Bitte wechseln Sie zu Bearbeiter oder Administrator, um Berichtsdaten hochzuladen oder zu ändern.",
      backToDashboard: "Zurück zum Dashboard",
      structuredUpload: "Strukturierter Upload",
      structuredUploadDescription: "Laden Sie Dateien nach Kategorie hoch, damit die richtigen Seiten/Diagramme zuverlässig erstellt werden können.",
      exportExcel: "Exportieren (Excel)",
      complaintsTitle: "Kunden- und Lieferantenreklamationsdateien",
      complaintsHelp: "Laden Sie Reklamationsbenachrichtigungen (Q1/Q2/Q3) hoch. Mehrere Dateien werden unterstützt.",
      deliveriesTitle: "Kunden- und Lieferantenlieferungsdateien",
      deliveriesHelp: "Laden Sie Outbound* (Kundenlieferungen) und Inbound* (Lieferanteneingänge) hoch. Mehrere Dateien werden unterstützt.",
      ppapTitle: "PPAP-Benachrichtigungsdateien",
      ppapHelp: "Laden Sie PPAP-Basis- und Statusextrakte hoch. Mehrere Dateien werden unterstützt.",
      deviationsTitle: "Abweichungsbenachrichtigungsdateien",
      deviationsHelp: "Laden Sie Abweichungsbasis- und Statusextrakte hoch. Mehrere Dateien werden unterstützt.",
      auditTitle: "Audit-Management-Dateien",
      auditHelp: "Laden Sie Audit-Quelldateien hoch (Platzhalter bis das Parsing implementiert ist). Mehrere Dateien werden unterstützt.",
      plantsTitle: "Werkübersichtsdateien",
      plantsHelp: "Laden Sie die offizielle Werkliste hoch (z.B. Webasto ET Plants .xlsx). Mehrere Dateien werden unterstützt.",
      uploadButton: "Hochladen",
      uploading: "Wird hochgeladen…",
      filesSelected: "Datei(en)",
      uploadCompleted: "Upload abgeschlossen",
      uploadFailed: "Upload fehlgeschlagen",
      usedIn: "Verwendet in:",
      recalculateKpis: "KPIs neu berechnen (Reklamationen + Lieferungen)",
      recalculateKpisDescription: "Wenn beide Kategorien hochgeladen wurden, KPIs berechnen und den Dashboard-Datensatz aktualisieren.",
      calculateKpis: "KPIs berechnen",
      latestKpiCalculation: "Letzte KPI-Berechnung",
      complaints: "Reklamationen:",
      deliveries: "Lieferungen:",
      siteMonthKpis: "Standort-Monat-KPIs:",
      openDashboard: "QOS ET Dashboard öffnen",
      manualDataEntry: "Manuelle Dateneingabe (Vorlage)",
      manualDataEntryDescription: "Geben Sie monatliche Werte pro Werk ein. Diese Einträge werden gespeichert und in den lokalen KPI-Datensatz (`qos-et-kpis`) zusammengeführt.",
      plant: "Werk (3-stellig)",
      cityLocation: "Stadt/Standort",
      month: "Monat",
      customerComplaintsQ1: "Kundenreklamationen (Q1)",
      supplierComplaintsQ2: "Lieferantenreklamationen (Q2)",
      internalComplaintsQ3: "Interne Reklamationen (Q3)",
      customerDefectiveParts: "Kundendefekteile",
      supplierDefectiveParts: "Lieferantendefekteile",
      internalDefectiveParts: "Interne Defekteile",
      outboundDeliveries: "Ausgangslieferungen (Kunde)",
      inboundDeliveries: "Eingangslieferungen (Lieferant)",
      ppapsInProgress: "PPAPs in Bearbeitung",
      ppapsCompleted: "PPAPs abgeschlossen",
      deviationsInProgress: "Abweichungen in Bearbeitung",
      deviationsCompleted: "Abweichungen abgeschlossen",
      deviationsTotalNote: "Abweichungen gesamt für KPIs = In Bearbeitung + Abgeschlossen.",
      auditsInternalSystem: "Audits: Internes System",
      auditsCertification: "Audits: Zertifizierung",
      auditsProcess: "Audits: Prozess",
      auditsProduct: "Audits: Produkt",
      poorQualityCosts: "Mangelkosten (Vorlage)",
      warrantyCosts: "Garantiekosten (Vorlage)",
      addEntry: "Eintrag hinzufügen",
      plantMustBe3Digits: "Werk muss ein 3-stelliger Code sein (z.B. 410).",
      manualEntries: "Manuelle Einträge",
      showingFirst10: "Zeige die ersten 10 Einträge. Exportieren Sie nach Excel, um alle anzuzeigen.",
      historyTitle: "Änderungsverlauf",
      historyDescription: "Jeder Upload und manuelle Eintrag wird mit Zeitstempel, Datensatzzählungen und Verwendungsreferenzen protokolliert.",
      noHistory: "Noch kein Verlauf.",
      files: "Dateien:",
      summary: "Zusammenfassung:",
      notes: "Hinweise:",
    },
  },
  it: {
    // Italian translations (placeholder - can be filled in later)
    common: {
      language: "Lingua",
      theme: "Tema",
      role: "Ruolo",
      dark: "Scuro",
      light: "Chiaro",
      reader: "Lettore",
      editor: "Editore",
      admin: "Amministratore",
      cancel: "Annulla",
      continue: "Continua",
      close: "Chiudi",
      save: "Salva",
      delete: "Elimina",
      edit: "Modifica",
      view: "Visualizza",
      search: "Cerca",
      filter: "Filtro",
      clear: "Cancella",
      selectAll: "Seleziona tutto",
      clearSelection: "Cancella selezione",
      noData: "Nessun dato disponibile",
      loading: "Caricamento...",
      error: "Errore",
      success: "Successo",
      month: "Mese",
      year: "Anno",
      from: "Da",
      to: "A",
      date: "Data",
      select: "Seleziona",
      months: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
      site: "Impianto",
      clickToShowAll: "Clicca per mostrare tutti gli impianti",
      clickToFilterBy: "Clicca per filtrare per",
      resetToShowAll: "Ripristina per mostrare tutti gli impianti",
      resetFilter: "Reimposta Filtro",
    },
    header: {
      title: "Rapporto Qualità QOS ET",
      reportDate: "Dicembre 2025",
    },
    sidebar: {
      dashboard: "Dashboard QOS ET",
      aiSummary: "Riepilogo Gestione AI",
      customerSupplierPerformance: "Prestazioni Cliente e Fornitore",
      customerPerformance: "Prestazioni Cliente",
      supplierPerformance: "Prestazioni Fornitore",
      costPerformance: "Prestazioni Costi",
      poorQualityCosts: "Costi Qualità Scarsa",
      warrantiesCosts: "Costi Garanzia",
      internalPerformance: "Prestazioni Interne",
      ppapsOverview: "Panoramica PPAP",
      deviationsOverview: "Panoramica Deviazioni",
      auditManagement: "Gestione Audit",
      uploadData: "Carica Dati",
      dataLineage: "Provenienza Dati",
      glossary: "FAQ e Glossario",
    },
    dashboard: {
      title: "Dashboard QOS ET YTD //",
      customerPerformance: "Prestazioni Cliente",
      supplierPerformance: "Prestazioni Fornitore",
      customerSupplierPerformance: "Prestazioni Cliente + Fornitore • Prestazioni Costi • Prestazioni Interne",
      showing12MonthLookback: "Mostra retrospettiva 12 mesi da",
      ytdCustomerMetrics: "Metriche Cliente YTD",
      ytdSupplierMetrics: "Metriche Fornitore YTD",
      customerComplaints: "Reclami Cliente",
      q1Notifications: "Notifiche Q1",
      customerDeliveries: "Consegne Cliente",
      partsShipped: "Parti spedite",
      customerPpm: "PPM Cliente",
      partsPerMillion: "Parti per Milione",
      supplierComplaints: "Reclami Fornitore",
      q2Notifications: "Notifiche Q2",
      supplierDeliveries: "Consegne Fornitore",
      partsReceived: "Parti ricevute",
      supplierPpm: "PPM Fornitore",
      internalComplaints: "Reclami Interni",
      q3Notifications: "Notifiche Q3",
      totalComplaints: "Totale Reclami",
      totalDeliveries: "Totale Consegne",
      totalPpm: "Totale PPM",
      costPerformance: "Prestazioni Costi",
      internalPerformance: "Prestazioni Interne",
      customerDefectiveParts: "Parti Difettose Cliente",
      supplierDefectiveParts: "Parti Difettose Fornitore",
      q1Defective: "Q1 difettoso",
      q2Defective: "Q2 difettoso",
      resetToShowAll: "Ripristina per mostrare tutti gli impianti",
      exportToExcel: "Esporta in Excel",
      clickToGenerateSummary: "Clicca per generare riepilogo",
      customerPpmSiteContribution: "PPM Cliente - Contributo Impianto per Mese",
      supplierPpmSiteContribution: "PPM Fornitore - Contributo Impianto per Mese",
      defectivePartsBySite: "Parti Difettose per Impianto",
      deliveriesBySite: "Consegne per Impianto",
      siteContribution: "(Contributo impianto)",
      allSites: "Tutti gli Impianti",
      ytdTotalNotificationsByMonth: "Totale Notifiche YTD per Mese e Impianto",
      ytdTotalDefectsByMonth: "Totale Difetti YTD per Mese e Impianto",
      customerPpmTrend: "Trend PPM Cliente",
      supplierPpmTrend: "Trend PPM Fornitore",
      monthlyTrend: "Trend Mensile",
    },
    filterPanel: {
      plant: "IMPIANTO",
      quickAccess: "ACCESSO RAPIDO",
      sapP01Sites: "Siti SAP P01",
      sapPS4Sites: "Siti SAP PS4",
      axSites: "Siti AX",
      automotiveSites: "Siti Automotive",
      aftermarketSites: "Siti Aftermarket",
      individualPlants: "Impianti Individuali",
      complaintTypes: "Tipi di Reclamo",
      customer: "Cliente",
      supplier: "Fornitore",
      internal: "Interno",
      notificationTypes: "Tipi di Notifica",
      customerComplaints: "Reclami Cliente",
      supplierComplaints: "Reclami Fornitore",
      internalComplaints: "Reclami Interni",
      deviations: "Deviazioni",
      ppap: "PPAP",
      dateRange: "Intervallo Date",
      fromDate: "Da Data",
      toDate: "A Data",
      pickDate: "Seleziona una data",
      clearAllFilters: "Cancella Tutti i Filtri",
      noPlantsAvailable: "Nessun impianto disponibile.",
      uploadDataFirst: "Carica prima i dati.",
    },
    roleAccess: {
      selectRole: "Seleziona ruolo di accesso",
      chooseRole: "Scegli il tuo ruolo per continuare.",
      switchRole: "Cambia ruolo",
      selectRoleDescription: "Seleziona un ruolo. Editore/Amministratore richiedono una password.",
      requiresPassword: "Inserisci password",
      wrongPassword: "Password errata.",
    },
    home: {
      title: "Potenziare l'Eccellenza Attraverso",
      subtitle: "Gestione Qualità Basata sui Dati",
      realTimePpmTracking: "Monitoraggio PPM\nin Tempo Reale",
      realTimePpmDescription: "Monitora Parts Per Million e metriche relative ai difetti in tutti i siti con aggiornamenti istantanei.",
      comprehensiveAnalysis: "Analisi\nCompleta",
      comprehensiveAnalysisDescription: "Approfondimenti dettagliati sulle prestazioni di qualità di clienti, fornitori e interne.",
      aiPoweredInsights: "Approfondimenti\nAlimentati dall'AI",
      aiPoweredInsightsDescription: "Ottieni raccomandazioni pratiche supportate dall'interpretazione avanzata dei dati delle macchine.",
      qualityAssurance: "Garanzia\nQualità AI",
      qualityAssuranceDescription: "Controllo e garanzia della qualità completi in tutte le operazioni utilizzando l'AI.",
      generateReport: "Genera Rapporto QOS ET",
      footerCopyright: "© 2025 QOS ET Report. Guidare l'Eccellenza nelle Operazioni e nella Qualità.",
      qualityManagementSystem: "Sistema di Gestione Qualità",
      login: "Accedi",
      loginDescription: "Seleziona il tuo ruolo per continuare al rapporto.",
    },
    upload: {
      title: "Carica Dati",
      description: "Caricamento strutturato + inserimento manuale per grafici e pagine KPI.",
      uploadFiles: "Carica File",
      enterData: "Inserisci Dati (Modulo)",
      changeHistory: "Cronologia Modifiche",
      accessDenied: "Accesso negato",
      accessDeniedDescription: "La modalità lettore è di sola lettura. Il caricamento di file o l'inserimento di dati è limitato.",
      switchToEditor: "Si prega di passare a Editore o Amministratore per caricare o modificare i dati del rapporto.",
      backToDashboard: "Torna alla Dashboard",
      structuredUpload: "Caricamento Strutturato",
      structuredUploadDescription: "Carica i file per categoria in modo che le pagine/grafici corretti possano essere costruiti in modo affidabile.",
      exportExcel: "Esporta (Excel)",
      complaintsTitle: "File Reclami Cliente e Fornitore",
      complaintsHelp: "Carica notifiche di reclamo (Q1/Q2/Q3). Supportati più file.",
      deliveriesTitle: "File Consegne Cliente e Fornitore",
      deliveriesHelp: "Carica Outbound* (consegne cliente) e Inbound* (consegne fornitore). Supportati più file.",
      ppapTitle: "File Notifiche PPAP",
      ppapHelp: "Carica estratti base PPAP + stato. Supportati più file.",
      deviationsTitle: "File Notifiche Deviazioni",
      deviationsHelp: "Carica estratti base Deviazioni + stato. Supportati più file.",
      auditTitle: "File Gestione Audit",
      auditHelp: "Carica file sorgente audit (segnaposto fino all'implementazione del parsing). Supportati più file.",
      plantsTitle: "File Panoramica Impianti",
      plantsHelp: "Carica l'elenco ufficiale degli impianti (es. Webasto ET Plants .xlsx). Supportati più file.",
      uploadButton: "Carica",
      uploading: "Caricamento in corso…",
      filesSelected: "file",
      uploadCompleted: "Caricamento completato",
      uploadFailed: "Caricamento fallito",
      usedIn: "Utilizzato in:",
      recalculateKpis: "Ricalcola KPI (Reclami + Consegne)",
      recalculateKpisDescription: "Quando entrambe le categorie sono caricate, calcola i KPI e aggiorna il dataset della dashboard.",
      calculateKpis: "Calcola KPI",
      latestKpiCalculation: "Ultimo Calcolo KPI",
      complaints: "Reclami:",
      deliveries: "Consegne:",
      siteMonthKpis: "KPI Sito-mese:",
      openDashboard: "Apri Dashboard QOS ET",
      manualDataEntry: "Inserimento Dati Manuale (Modello)",
      manualDataEntryDescription: "Inserisci valori mensili per impianto. Queste voci vengono salvate e unite nel dataset KPI locale (`qos-et-kpis`).",
      plant: "Impianto (3 cifre)",
      cityLocation: "Città/Posizione",
      month: "Mese",
      customerComplaintsQ1: "Reclami Cliente (Q1)",
      supplierComplaintsQ2: "Reclami Fornitore (Q2)",
      internalComplaintsQ3: "Reclami Interni (Q3)",
      customerDefectiveParts: "Parti Difettose Cliente",
      supplierDefectiveParts: "Parti Difettose Fornitore",
      internalDefectiveParts: "Parti Difettose Interne",
      outboundDeliveries: "Consegne in Uscita (Cliente)",
      inboundDeliveries: "Consegne in Entrata (Fornitore)",
      ppapsInProgress: "PPAP in Corso",
      ppapsCompleted: "PPAP Completati",
      deviationsInProgress: "Deviazioni in Corso",
      deviationsCompleted: "Deviazioni Completate",
      deviationsTotalNote: "Totale deviazioni utilizzato dai KPI = In Corso + Completate.",
      auditsInternalSystem: "Audit: Sistema Interno",
      auditsCertification: "Audit: Certificazione",
      auditsProcess: "Audit: Processo",
      auditsProduct: "Audit: Prodotto",
      poorQualityCosts: "Costi Qualità Scarsa (modello)",
      warrantyCosts: "Costi Garanzia (modello)",
      addEntry: "Aggiungi Voce",
      plantMustBe3Digits: "L'impianto deve essere un codice a 3 cifre (es. 410).",
      manualEntries: "Voci Manuali",
      showingFirst10: "Mostra le prime 10 voci. Esporta in Excel per visualizzare tutte.",
      historyTitle: "Cronologia Modifiche",
      historyDescription: "Ogni caricamento e voce manuale viene registrato con timestamp, conteggi record e riferimenti di utilizzo.",
      noHistory: "Nessuna cronologia ancora.",
      files: "File:",
      summary: "Riepilogo:",
      notes: "Note:",
    },
  },
};

export function getTranslations(lang: LanguageKey): Translations {
  return translations[lang] || translations.en;
}

export const LANGUAGE_CHANGED_EVENT = "qos-et-language-changed";

