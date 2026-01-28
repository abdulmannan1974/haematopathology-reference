import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Search, ChevronDown, ChevronUp, Star, Clock, GitCompare, X, Download, Upload, Share2, FileText, Printer, Info, BookOpen, Microscope, Filter, Zap, Target, Layers, CheckCircle2 } from 'lucide-react';

const HaematopathologyReference = () => {
  // Core state
  const [activeTab, setActiveTab] = useState('aml');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCards, setExpandedCards] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);

  // Compare state
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState([]);

  // UI state
  const [showFavorites, setShowFavorites] = useState(false);
  const [showRecent, setShowRecent] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Search filters
  const [searchFilter, setSearchFilter] = useState('all');
  const [prognosisFilter, setPrognosisFilter] = useState('all');
  const [globalSearch, setGlobalSearch] = useState(false);

  // Refs
  const fileInputRef = useRef(null);
  const exportMenuRef = useRef(null);
  const searchInputRef = useRef(null);

  // ============= DISEASE DATA =============
  const diseases = {
    aml: {
      good: [
        {
          name: 'Core Binding Factor AML - t(8;21)',
          gene: 'RUNX1::RUNX1T1',
          features: [
            'Blasts with salmon/pink granules',
            'Predominant in younger patients',
            '>70% show additional abnormalities (sex chr loss, del(9q))'
          ]
        },
        {
          name: 'Core Binding Factor AML - inv(16)',
          gene: 'CBFB::MYH11',
          features: [
            'Abnormal eosinophils',
            'Worse prognosis when KIT mutated'
          ]
        },
        {
          name: 'Acute Promyelocytic Leukemia',
          gene: 't(15;17) PML::RARA',
          features: [
            'Bilobed blasts with granules ± Auer rods',
            'Associated with DIC',
            'Sensitive to ATRA/arsenic',
            'ZBTB16::RARA and STAT5B::RARA variants resistant to ATRA'
          ]
        },
        {
          name: 'NPM1 mutation',
          gene: 'NPM1 without FLT3-ITD',
          features: ['Good prognosis marker']
        },
        {
          name: 'CEBPA double mutation',
          gene: 'bZIP and smbZIP mutated CEBPA',
          features: [
            'In-frame mutations',
            'FLT3-ITD in 5-9% (still better than FLT3-ITD without CEBPA)'
          ]
        }
      ],
      intermediate: [
        {
          name: 't(9;11) KMT2A',
          gene: 'MLLT3::KMT2A',
          features: [
            'Monocytic differentiation',
            'Fine azurophilic granules',
            'Associated with gingival myeloid sarcoma',
            'Common in children (10% pediatric AML)',
            'Common secondary abnormality: +8'
          ]
        },
        {
          name: 'Normal Karyotype',
          gene: 'Mutation status unknown/negative',
          features: ['Intermediate prognosis']
        }
      ],
      poor: [
        {
          name: 't(6;9) AML',
          gene: 'DEK::NUP214',
          features: [
            'Often with basophilia and multilineage dysplasia',
            'Usually sole abnormality',
            'FLT3-ITD common'
          ]
        },
        {
          name: 'inv(3)/t(3;3)',
          gene: 'GATA2, MECOM',
          features: [
            'Abnormal megakaryocytes',
            'Multilineage dysplasia',
            'Common: -7 (50%), del(5q), complex karyotype'
          ]
        },
        {
          name: 'AML with MDS features',
          gene: 'Various MDS mutations',
          features: [
            '>20% blasts (WHO); 10% blasts (ICC)',
            'MDS-related cytogenetics',
            'ASXL1, BCOR, EZH2, SF3B1, SRSF2, STAG2, U2AF1, ZRSR2'
          ]
        },
        {
          name: '11q23 (non-t(9;11))',
          gene: 'KMT2A rearrangements',
          features: ['Many partners: t(4;11), t(11;19)']
        },
        {
          name: 't(9;22) BCR::ABL1',
          gene: 'P210 or P190',
          features: ['Usually with -7, +8, complex karyotype']
        },
        {
          name: 'NUP98 rearrangement',
          gene: '>30 fusion partners',
          features: ['2nd most common in relapsed pediatric AML']
        },
        {
          name: 'FLT3-ITD mutation',
          gene: 'FLT3-ITD',
          features: ['~20% AML cases', 'Poor prognosis']
        },
        {
          name: 'Poor risk mutations',
          gene: 'ASXL1, TP53, RUNX1',
          features: ['Associated with adverse outcomes']
        }
      ]
    },
    mds: {
      cytogenetics: [
        {
          name: 'Very Good Prognosis',
          gene: 'del(11q) or -Y',
          features: ['del(11q)', '-Y']
        },
        {
          name: 'Good Prognosis',
          gene: 'Multiple cytogenetic markers',
          features: [
            'Normal karyotype',
            'del(5q), del(12p), del(20q)',
            'Monosomy 13 or del(13q)',
            'Double including del(5q)'
          ]
        },
        {
          name: 'Intermediate Prognosis',
          gene: 'Multiple cytogenetic markers',
          features: [
            'del(7q)',
            'Monosomy 5',
            'Trisomy 8, trisomy 19',
            'del(17p) or i(17)(q10)',
            'Any other single or double clones'
          ]
        },
        {
          name: 'Poor Prognosis',
          gene: 'Monosomy 7 and others',
          features: [
            'Monosomy 7',
            'inv(3), t(3;3), del(3q)',
            'Double including -7/7q-',
            '3 abnormalities'
          ]
        },
        {
          name: 'Very Poor Prognosis',
          gene: 'Complex karyotype',
          features: ['Complex (>3 abnormalities)']
        }
      ],
      mutations: [
        {
          name: 'SF3B1 mutation (Good)',
          gene: 'SF3B1',
          features: [
            'Strongly correlated with ring sideroblasts',
            'MDS-RS with ≥5% rings (vs ≥15% without mutation)'
          ]
        },
        {
          name: 'Bi-allelic TP53 (Poor)',
          gene: 'TP53',
          features: ['Mutations and/or copy number loss, or cnLOH']
        },
        {
          name: 'Other poor prognosis',
          gene: 'Multiple genes',
          features: ['ASXL1, SRSF2, STAG2, EZH2, U2AF1, RUNX1, NRAS']
        }
      ]
    },
    mpn: {
      cml: [
        {
          name: 'Chronic Myelogenous Leukemia',
          gene: 't(9;22) BCR::ABL1',
          features: [
            'Usually M-BCR (p210)',
            'Rarely m-BCR (p190) or μ-BCR (p230)',
            'ABL1 kinase mutations confer TKI resistance (esp. T315I)',
            'Transformation: extra Ph, i(17)(q10), +8, +19'
          ]
        }
      ],
      pv: [
        {
          name: 'Polycythemia Vera',
          gene: 'JAK2 V617F (~95%)',
          features: ['JAK2 exon 12 mutation (~5%)']
        }
      ],
      etpmf: [
        {
          name: 'Essential Thrombocythemia / PMF',
          gene: 'Multiple mutations',
          features: [
            'JAK2 V617F (~50%)',
            'CALR exon 9 indels (~30%)',
            'MPL W515K/L, S505N/A (~8%)',
            'Poor prognosis: TET2, IDH1/2, ASXL1, SRSF2, U2AF1'
          ]
        }
      ],
      cnl: [
        {
          name: 'Chronic Neutrophilic Leukemia',
          gene: 'CSF3R mutations',
          features: [
            'T618I and T615A most common',
            'Present in 50-80% of CNL'
          ]
        }
      ],
      mastocytosis: [
        {
          name: 'Mastocytosis',
          gene: 'KIT D816V (~95%)',
          features: [
            'TET2 mutations in ~25% (more aggressive)',
            'Additional: SRSF2 (30-40%), ASXL1 (24%), IDH2 (7%)'
          ]
        }
      ]
    },
    bcell: {
      all: [
        {
          name: 'High Hyperdiploid (Good)',
          gene: '50-66 chromosomes',
          features: [
            '~25% pediatric B-ALL',
            'Common: +21, +X, +14, +4'
          ]
        },
        {
          name: 't(12;21) (Good)',
          gene: 'ETV6::RUNX1',
          features: ['~25% pediatric B-ALL', 'Cryptic fusion']
        },
        {
          name: 't(9;22) (Poor)',
          gene: 'BCR::ABL1',
          features: [
            'm-BCR common',
            'Pediatric: mostly p190',
            'Adults: 50% p190, 50% p210'
          ]
        },
        {
          name: 'KMT2A-rearranged (Poor)',
          gene: 't(v;11q23)',
          features: [
            'Most common in infants <1 year',
            'Partners: AFF1 (4q21), MLLT1 (19p13)'
          ]
        },
        {
          name: 'Hypodiploid (Poor)',
          gene: 'Various chromosomes lost',
          features: [
            'Near haploid (25-29 chr) worst',
            'Low hypodiploid (33-39 chr) associated with germline TP53'
          ]
        },
        {
          name: 'BCR::ABL1-like (Poor)',
          gene: 'No BCR::ABL1 translocation',
          features: [
            '15-20% pediatric ALL',
            'CRLF2, ABL1/2, PDGFRB, JAK2, EPOR rearrangements'
          ]
        }
      ],
      lymphomas: [
        {
          name: 'Follicular Lymphoma',
          gene: 't(14;18) IGH::BCL2',
          features: [
            '80-90% cases',
            'Negative cases may have BCL6 (3q27)',
            'Grade 3B: more BCL6 rearrangements',
            'Poor prognosis: del(17p), del(6q)'
          ]
        },
        {
          name: 'Mantle Cell Lymphoma',
          gene: 't(11;14) IGH::CCND1',
          features: [
            '>95% cases',
            'TP53/CDKN2A deletion, complex karyotype: adverse',
            '"Double hit" MCL: t(8;14) + CCND1 rearrangement',
            'Mutations: ATM, CCND1, KMT2D, NOTCH1/2, TP53'
          ]
        },
        {
          name: 'Hairy Cell Leukemia',
          gene: 'BRAF p.V600E',
          features: [
            '~95% classical HCL',
            'HCL variant: IGHV4-34 (~10-20%), MAP2K1, poorer prognosis'
          ]
        },
        {
          name: 'CLL/SLL - Good Prognosis',
          gene: 'del(13q14) sole',
          features: ['Mutated IGHV (≥2%)']
        },
        {
          name: 'CLL/SLL - Intermediate',
          gene: 'Trisomy 12, Normal',
          features: ['NOTCH1 and/or SF3B1 mutation']
        },
        {
          name: 'CLL/SLL - Poor Prognosis',
          gene: '17p13 deletion, del(11)',
          features: ['TP53 and/or BIRC3 mutation']
        },
        {
          name: 'Lymphoplasmacytic Lymphoma',
          gene: 'MYD88 p.L265P',
          features: [
            '~90% LPL',
            'CXCR4 mutation (~30% LPL, ~20% IgM MGUS)',
            'ARID1A (~17%)'
          ]
        },
        {
          name: 'DLBCL/HGBL with MYC + BCL2',
          gene: 'Double/Triple hit',
          features: ['MYC with BCL2 and/or BCL6 rearrangement']
        },
        {
          name: 'DLBCL - ABC type',
          gene: 'CARD11, MYD88, CD79B',
          features: ['BCL6 rearrangements, gains 3q27.3, 11q23q24, 18q21.3']
        },
        {
          name: 'DLBCL - GCB type',
          gene: 'EZH2, GNA13',
          features: ['t(14;18)/IGH::BCL2, gains 2p16, 8q24']
        },
        {
          name: 'Burkitt Lymphoma',
          gene: 'MYC rearrangements',
          features: [
            't(8;14) IGH::MYC or',
            't(2;8) IGK::MYC or',
            't(8;22) IGL::MYC',
            'Additional: gains 1q, 7, 12; losses 6q, 13q, 17p'
          ]
        }
      ]
    },
    tcell: {
      all: [
        {
          name: 'T-Lymphoblastic Leukemia/Lymphoma',
          gene: 'TR gene rearrangements',
          features: [
            'IGH rearrangement (~20%)',
            'TCR translocations with TLX1, TLX3 (favorable)',
            'TAL1::STIL (favorable)',
            'PICALM::MLLT3, KMT2A, NUP214::ABL1, MYC',
            'NOTCH1 (70%), CDKN2A/B deletions (>70%)'
          ]
        },
        {
          name: 'Early T-precursor ALL',
          gene: 'Multiple mutations',
          features: ['FLT3, NRAS/KRAS, DNMT3A, IDH1/2, NOTCH1, CDKN1/1']
        }
      ],
      lymphomas: [
        {
          name: 'ALK-negative ALCL',
          gene: 'DUSP22/IRF4 at 6p25',
          features: [
            '~30% with 6p25 (good prognosis)',
            'TP63 rearrangement (~8%, poor)',
            'JAK1/STAT3 mutations'
          ]
        },
        {
          name: 'ALK-positive ALCL',
          gene: 'ALK rearrangements',
          features: [
            't(2;5) NPM1::ALK most common',
            'TR rearrangements (~90%)',
            'Better long-term survival than ALK-'
          ]
        },
        {
          name: 'T-LGL Leukemia',
          gene: 'STAT3, STAT5B',
          features: ['TRG rearrangement in all cases']
        },
        {
          name: 'PTCL-NOS',
          gene: 'Complex',
          features: [
            'TR rearrangements most cases',
            'Complex karyotype',
            'TET2, DNMT3A, VAV1',
            'GATA3 vs TBX21 profiles'
          ]
        },
        {
          name: 'Angioimmunoblastic T-cell',
          gene: 'RHOA, TET2, DNMT3A',
          features: [
            'TR rearrangements (75-90%)',
            'IDH2, CD28, PLCG1, FYN mutations',
            '+3, +5, +21, +X, del(6q), 22q+, +19, 11q13+'
          ]
        },
        {
          name: 'T-Prolymphocytic Leukemia',
          gene: 'inv(14) or t(X;14)',
          features: [
            'Aggressive',
            'ATM, STAT5B, JAK1, JAK3',
            'inv(14) (~80%), t(14;14) (~10%)',
            'TCL1A rearrangements'
          ]
        }
      ]
    },
    other: {
      cmml: [
        {
          name: 'Chronic Myelomonocytic Leukemia',
          gene: 'Multiple mutations',
          features: [
            'TET2 (~50%)',
            'SRSF2 (~30-50%, poor)',
            'ASXL1 (40-50%, poor if missense excluded)',
            'EZH2 (poor), RUNX1 (~15%)',
            'KRAS/NRAS (~15%, adverse)',
            'CBL (~10-20%), SETBP1 (~5-10%, poor)',
            'Cytogenetics: +8, -7, -Y, PDGFRB, i(17q)'
          ]
        }
      ],
      acml: [
        {
          name: 'MDS/MPN with neutrophilia',
          gene: 'SETBP1, ASXL1, SRSF2',
          features: [
            'Previously atypical CML',
            'BCR::ABL1 negative',
            'SETBP1 (~20-30%, D868N most common)',
            'ASXL1 (65%), SRSF2, TET2 (~40%)',
            '+8, del(20q), i(17q)'
          ]
        }
      ],
      jmml: [
        {
          name: 'Juvenile Myelomonocytic Leukemia',
          gene: 'PTPN11, KRAS/NRAS, NF1',
          features: [
            'Somatic PTPN11 (35%, poor)',
            'KRAS/NRAS (~20-25%, poor)',
            'Germline NF1 (poor) or somatic NF1',
            'Germline CBL (10-15%, favorable)',
            'Secondary: SETBP1, JAK3, SH2B3, ASXL1'
          ]
        }
      ],
      mlntk: [
        {
          name: 'MLN with Eosinophilia + TK fusion',
          gene: 'Various TK fusions',
          features: [
            'PDGFRA (FIP1L1::PDGFRA)',
            'PDGFRB (ETV6::PDGFRB)',
            'FGFR1 (various)',
            'JAK2 (PCM1::JAK2)',
            'FLT3 (ETV6::FLT3)',
            'ABL1 (ETV6::ABL1)'
          ]
        }
      ],
      germline: [
        {
          name: 'Germline Predisposition',
          gene: 'Multiple genes',
          features: [
            'Without platelet disorder: CEBPA, DDX41, TP53',
            'With platelet disorder: RUNX1, ANKRD26, ETV6',
            'With organ dysfunction: GATA2, BM failure syndromes',
            'RASopathies: NF1, CBL, Noonan syndrome',
            'Down syndrome, SAMD9, SAMD9L, BLM'
          ]
        }
      ],
      histiocytic: [
        {
          name: 'Histiocytic disorders',
          gene: 'BRAF, MAP2K1, ARAF',
          features: [
            'Langerhans cell histiocytosis',
            'Histiocytic sarcoma',
            'Erdheim-Chester disease',
            'BRAF p.V600E (~25-50%)',
            'MAP2K1 (~25%)'
          ]
        }
      ]
    }
  };

  // ============= CATEGORY DEFINITIONS =============
  const categories = [
    { id: 'aml', label: 'AML', icon: '🔴', description: 'Acute Myeloid Leukemia' },
    { id: 'mds', label: 'MDS', icon: '🟡', description: 'Myelodysplastic Syndromes' },
    { id: 'mpn', label: 'MPN', icon: '🟢', description: 'Myeloproliferative Neoplasms' },
    { id: 'bcell', label: 'B-cell', icon: '🔵', description: 'B-cell Neoplasms' },
    { id: 'tcell', label: 'T-cell', icon: '🟣', description: 'T-cell Neoplasms' },
    { id: 'other', label: 'Other', icon: '⚪', description: 'Other Haematological Disorders' }
  ];

  // Quick search presets
  const quickSearchTerms = [
    { label: 'JAK2', term: 'JAK2' },
    { label: 'FLT3', term: 'FLT3' },
    { label: 'NPM1', term: 'NPM1' },
    { label: 'BCR::ABL1', term: 'BCR::ABL1' },
    { label: 'TP53', term: 'TP53' },
    { label: 'BRAF', term: 'BRAF' },
  ];

  // ============= EFFECTS =============
  // Load from localStorage
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('hematpath-favorites');
      const savedRecent = localStorage.getItem('hematpath-recent');
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
      if (savedRecent) setRecentSearches(JSON.parse(savedRecent));
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }, []);

  // Save favorites
  useEffect(() => {
    try {
      localStorage.setItem('hematpath-favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, [favorites]);

  // Save recent searches
  useEffect(() => {
    try {
      localStorage.setItem('hematpath-recent', JSON.stringify(recentSearches));
    } catch (error) {
      console.error('Error saving recent searches:', error);
    }
  }, [recentSearches]);

  // Add to recent searches
  useEffect(() => {
    if (searchTerm.trim() && searchTerm.length > 2) {
      const timer = setTimeout(() => {
        setRecentSearches(prev => {
          const filtered = prev.filter(s => s !== searchTerm);
          return [searchTerm, ...filtered].slice(0, 10);
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [searchTerm]);

  // Close export menu on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ============= HELPER FUNCTIONS =============
  const toggleCard = (id) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleFavorite = (disease, category, prognosis) => {
    const id = `${category}-${prognosis}-${disease.name}`;
    setFavorites(prev => {
      const exists = prev.find(f => f.id === id);
      if (exists) {
        return prev.filter(f => f.id !== id);
      }
      return [...prev, { disease, category, prognosis, id }];
    });
  };

  const isFavorite = (disease, category, prognosis) => {
    const id = `${category}-${prognosis}-${disease.name}`;
    return favorites.some(f => f.id === id);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('hematpath-recent');
  };

  const toggleCompareSelection = (disease, category, prognosis) => {
    const id = `${category}-${prognosis}-${disease.name}`;
    setSelectedForCompare(prev => {
      const exists = prev.find(s => s.id === id);
      if (exists) {
        return prev.filter(s => s.id !== id);
      }
      if (prev.length >= 4) {
        alert('Maximum 4 diseases for comparison');
        return prev;
      }
      return [...prev, { disease, category, prognosis, id }];
    });
  };

  const isSelectedForCompare = (disease, category, prognosis) => {
    const id = `${category}-${prognosis}-${disease.name}`;
    return selectedForCompare.some(s => s.id === id);
  };

  // ============= FILTERED DATA =============
  const filteredDiseases = useMemo(() => {
    let filtered = {};

    if (showFavorites) {
      favorites.forEach(fav => {
        if (!filtered[fav.category]) filtered[fav.category] = {};
        if (!filtered[fav.category][fav.prognosis]) filtered[fav.category][fav.prognosis] = [];
        filtered[fav.category][fav.prognosis].push(fav.disease);
      });
      return filtered;
    }

    const term = searchTerm.toLowerCase();
    const categoriesToSearch = globalSearch ? Object.keys(diseases) : [activeTab];

    categoriesToSearch.forEach(category => {
      if (!diseases[category]) return;
      filtered[category] = {};

      Object.keys(diseases[category]).forEach(subcategory => {
        // Prognosis filter
        if (prognosisFilter !== 'all') {
          if (prognosisFilter === 'good' && !['good'].includes(subcategory)) return;
          if (prognosisFilter === 'intermediate' && !['intermediate'].includes(subcategory)) return;
          if (prognosisFilter === 'poor' && !['poor'].includes(subcategory)) return;
        }

        const items = diseases[category][subcategory].filter(disease => {
          if (!term) return true;

          switch (searchFilter) {
            case 'name':
              return disease.name.toLowerCase().includes(term);
            case 'gene':
              return disease.gene.toLowerCase().includes(term);
            case 'features':
              return disease.features.some(f => f.toLowerCase().includes(term));
            default:
              return (
                disease.name.toLowerCase().includes(term) ||
                disease.gene.toLowerCase().includes(term) ||
                disease.features.some(f => f.toLowerCase().includes(term))
              );
          }
        });

        if (items.length > 0) {
          filtered[category][subcategory] = items;
        }
      });
    });

    return filtered;
  }, [searchTerm, showFavorites, favorites, searchFilter, prognosisFilter, globalSearch, activeTab, diseases]);

  // Count results
  const searchResultsCount = useMemo(() => {
    let count = 0;
    Object.values(filteredDiseases).forEach(category => {
      Object.values(category).forEach(subcategory => {
        count += subcategory.length;
      });
    });
    return count;
  }, [filteredDiseases]);

  // Highlight matches
  const highlightMatch = (text, term) => {
    if (!term || term.length < 2) return text;
    try {
      const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      const parts = text.split(regex);
      return parts.map((part, i) =>
        regex.test(part) ? <mark key={i} className="bg-yellow-300 px-0.5 rounded">{part}</mark> : part
      );
    } catch {
      return text;
    }
  };

  // Prognosis colors
  const getPrognosisColor = (prognosis) => {
    const colors = {
      good: 'bg-green-100 border-green-400 text-green-900',
      intermediate: 'bg-yellow-100 border-yellow-400 text-yellow-900',
      poor: 'bg-red-100 border-red-400 text-red-900',
      default: 'bg-blue-100 border-blue-400 text-blue-900'
    };
    return colors[prognosis] || colors.default;
  };

  // Category stats
  const getCategoryStats = (categoryId) => {
    const categoryData = diseases[categoryId];
    let total = 0;
    Object.values(categoryData).forEach(subcategory => {
      total += subcategory.length;
    });
    return total;
  };

  const totalDiseases = Object.keys(diseases).reduce((sum, cat) => sum + getCategoryStats(cat), 0);

  // ============= EXPORT FUNCTIONS =============
  const exportAsJSON = () => {
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      exportedBy: 'Haematopathology Reference Tool',
      favorites: favorites,
      totalCount: favorites.length
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hematpath-favorites-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const exportAsText = () => {
    let textContent = `HAEMATOPATHOLOGY REFERENCE - FAVORITES LIST\n`;
    textContent += `Exported: ${new Date().toLocaleString()}\n`;
    textContent += `Total Items: ${favorites.length}\n`;
    textContent += `${'='.repeat(70)}\n\n`;

    const grouped = favorites.reduce((acc, fav) => {
      if (!acc[fav.category]) acc[fav.category] = {};
      if (!acc[fav.category][fav.prognosis]) acc[fav.category][fav.prognosis] = [];
      acc[fav.category][fav.prognosis].push(fav);
      return acc;
    }, {});

    Object.keys(grouped).forEach(category => {
      textContent += `\n${category.toUpperCase()}\n${'-'.repeat(70)}\n`;
      Object.keys(grouped[category]).forEach(prognosis => {
        textContent += `\n  ${prognosis.toUpperCase()}\n`;
        grouped[category][prognosis].forEach((fav, idx) => {
          textContent += `\n  ${idx + 1}. ${fav.disease.name}\n`;
          textContent += `     Gene: ${fav.disease.gene}\n`;
          fav.disease.features.forEach(feature => {
            textContent += `     - ${feature}\n`;
          });
        });
      });
    });

    textContent += `\n${'='.repeat(70)}\n`;
    textContent += `By Dr Abdul Mannan FRCPath FCPS | Blood🩸Doctor\n`;

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hematpath-favorites-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const copyShareableText = () => {
    let shareText = `📚 Haematopathology Reference - My Favorites (${favorites.length} items)\n\n`;

    const grouped = favorites.reduce((acc, fav) => {
      if (!acc[fav.category]) acc[fav.category] = [];
      acc[fav.category].push(fav);
      return acc;
    }, {});

    Object.keys(grouped).forEach(category => {
      shareText += `${category.toUpperCase()}:\n`;
      grouped[category].forEach(fav => {
        shareText += `• ${fav.disease.name} (${fav.disease.gene})\n`;
      });
      shareText += `\n`;
    });

    shareText += `By Dr Abdul Mannan FRCPath FCPS | Blood🩸Doctor`;

    navigator.clipboard.writeText(shareText).then(() => {
      alert('Copied to clipboard!');
      setShowExportMenu(false);
    });
  };

  const importFromJSON = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target.result);
        if (!importData.favorites || !Array.isArray(importData.favorites)) {
          alert('Invalid file format');
          return;
        }

        const confirmImport = window.confirm(
          `Import ${importData.favorites.length} favorites?\nThis will add to your existing ${favorites.length} favorites.`
        );

        if (confirmImport) {
          const existingIds = new Set(favorites.map(f => f.id));
          const newFavorites = importData.favorites.filter(f => !existingIds.has(f.id));
          setFavorites(prev => [...prev, ...newFavorites]);
          alert(`Imported ${newFavorites.length} new favorites!`);
        }
      } catch {
        alert('Error reading file');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  // ============= COMPARISON FUNCTIONS =============
  const getComparisonAnalysis = useCallback(() => {
    if (selectedForCompare.length < 2) return null;

    const allFeatures = selectedForCompare.map(item =>
      new Set(item.disease.features.map(f => f.toLowerCase()))
    );

    const commonFeatures = [];
    if (allFeatures.length > 0) {
      allFeatures[0].forEach(feature => {
        if (allFeatures.every(set => set.has(feature))) {
          const original = selectedForCompare[0].disease.features.find(
            f => f.toLowerCase() === feature
          );
          if (original) commonFeatures.push(original);
        }
      });
    }

    const uniqueFeatures = selectedForCompare.map((item, idx) => {
      return item.disease.features.filter(feature => {
        const lowerFeature = feature.toLowerCase();
        return allFeatures.every((set, setIdx) =>
          setIdx === idx || !set.has(lowerFeature)
        );
      });
    });

    return { commonFeatures, uniqueFeatures };
  }, [selectedForCompare]);

  const exportComparison = () => {
    if (selectedForCompare.length === 0) return;

    let text = `HAEMATOPATHOLOGY COMPARISON\n`;
    text += `Generated: ${new Date().toLocaleString()}\n`;
    text += `${'='.repeat(60)}\n\n`;

    selectedForCompare.forEach((item, idx) => {
      text += `${idx + 1}. ${item.disease.name}\n`;
      text += `   Category: ${item.category.toUpperCase()} | Prognosis: ${item.prognosis || 'N/A'}\n`;
      text += `   Gene: ${item.disease.gene}\n`;
      text += `   Features:\n`;
      item.disease.features.forEach(f => {
        text += `   - ${f}\n`;
      });
      text += `\n`;
    });

    const analysis = getComparisonAnalysis();
    if (analysis && analysis.commonFeatures.length > 0) {
      text += `COMMON FEATURES:\n`;
      analysis.commonFeatures.forEach(f => {
        text += `- ${f}\n`;
      });
    }

    text += `\n${'='.repeat(60)}\n`;
    text += `By Dr Abdul Mannan FRCPath FCPS | Blood🩸Doctor\n`;

    navigator.clipboard.writeText(text).then(() => {
      alert('Comparison copied to clipboard!');
    });
  };

  // ============= RENDER FUNCTIONS =============
  const renderDiseaseCard = (disease, index, prognosis, category) => {
    const cardId = `${category}-${prognosis}-${index}`;
    const isExpanded = expandedCards[cardId];
    const favorited = isFavorite(disease, category, prognosis);
    const selectedCompare = isSelectedForCompare(disease, category, prognosis);

    return (
      <div
        key={cardId}
        className={`border-2 rounded-lg p-4 mb-3 transition-all hover:shadow-md ${
          getPrognosisColor(prognosis)
        } ${selectedCompare ? 'ring-4 ring-blue-500 shadow-lg' : ''}`}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1 cursor-pointer" onClick={() => toggleCard(cardId)}>
            {globalSearch && searchTerm && (
              <span className="inline-block text-xs font-bold uppercase tracking-wide bg-gray-200 text-gray-600 px-2 py-0.5 rounded mb-2">
                {category}
              </span>
            )}
            <h3 className="font-bold text-lg mb-1">
              {highlightMatch(disease.name, searchTerm)}
            </h3>
            <p className="font-mono text-sm font-semibold">
              {highlightMatch(disease.gene, searchTerm)}
            </p>
          </div>

          <div className="flex gap-2 ml-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!compareMode) setCompareMode(true);
                toggleCompareSelection(disease, category, prognosis);
              }}
              className={`p-2 rounded-lg transition-colors ${
                selectedCompare
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white/70 hover:bg-white border border-gray-300'
              }`}
              title={selectedCompare ? 'Remove from comparison' : 'Add to comparison'}
            >
              <GitCompare size={18} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(disease, category, prognosis);
              }}
              className={`p-2 rounded-lg transition-colors ${
                favorited ? 'bg-yellow-400 text-white' : 'bg-white/70 hover:bg-white border border-gray-300'
              }`}
              title={favorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star size={18} fill={favorited ? 'white' : 'none'} />
            </button>

            <button
              onClick={() => toggleCard(cardId)}
              className="p-2 hover:bg-white/50 rounded-lg"
            >
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        </div>

        {isExpanded && (
          <ul className="mt-3 space-y-1 text-sm border-t pt-3">
            {disease.features.map((feature, idx) => (
              <li key={idx} className="flex items-start">
                <span className="mr-2 text-gray-500">•</span>
                <span>{highlightMatch(feature, searchTerm)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  const renderComparisonView = () => {
    if (selectedForCompare.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          <GitCompare size={64} className="mx-auto mb-4 text-gray-300" />
          <p className="text-xl mb-2">No diseases selected for comparison</p>
          <p className="mb-6">Click the <GitCompare size={16} className="inline" /> button on any disease card to add it (max 4)</p>

          <div className="mt-8 max-w-2xl mx-auto">
            <p className="text-sm font-semibold mb-3 text-gray-600">Quick Comparisons:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => {
                  const cbf1 = diseases.aml.good[0];
                  const cbf2 = diseases.aml.good[1];
                  setSelectedForCompare([
                    { disease: cbf1, category: 'aml', prognosis: 'good', id: `aml-good-${cbf1.name}` },
                    { disease: cbf2, category: 'aml', prognosis: 'good', id: `aml-good-${cbf2.name}` }
                  ]);
                }}
                className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm transition-colors"
              >
                CBF AMLs: t(8;21) vs inv(16)
              </button>
              <button
                onClick={() => {
                  const flt3 = diseases.aml.poor.find(d => d.name.includes('FLT3'));
                  const npm1 = diseases.aml.good.find(d => d.name.includes('NPM1'));
                  if (flt3 && npm1) {
                    setSelectedForCompare([
                      { disease: npm1, category: 'aml', prognosis: 'good', id: `aml-good-${npm1.name}` },
                      { disease: flt3, category: 'aml', prognosis: 'poor', id: `aml-poor-${flt3.name}` }
                    ]);
                  }
                }}
                className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm transition-colors"
              >
                NPM1 vs FLT3-ITD
              </button>
              <button
                onClick={() => {
                  const cllGood = diseases.bcell.lymphomas.find(d => d.name.includes('CLL') && d.name.includes('Good'));
                  const cllPoor = diseases.bcell.lymphomas.find(d => d.name.includes('CLL') && d.name.includes('Poor'));
                  if (cllGood && cllPoor) {
                    setSelectedForCompare([
                      { disease: cllGood, category: 'bcell', prognosis: 'lymphomas', id: `bcell-lymphomas-${cllGood.name}` },
                      { disease: cllPoor, category: 'bcell', prognosis: 'lymphomas', id: `bcell-lymphomas-${cllPoor.name}` }
                    ]);
                  }
                }}
                className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm transition-colors"
              >
                CLL: Good vs Poor Prognosis
              </button>
            </div>
          </div>
        </div>
      );
    }

    const analysis = getComparisonAnalysis();

    return (
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex flex-wrap justify-between items-center bg-blue-50 p-4 rounded-lg border border-blue-200 gap-4">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-blue-900">
              Comparing {selectedForCompare.length} disease{selectedForCompare.length !== 1 ? 's' : ''}
            </span>
            {selectedForCompare.length < 4 && (
              <span className="text-sm text-blue-600">
                (can add {4 - selectedForCompare.length} more)
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportComparison}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center gap-2 text-sm transition-colors"
            >
              <Share2 size={16} />
              Copy to Clipboard
            </button>
            <button
              onClick={() => setSelectedForCompare([])}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Common features */}
        {analysis && analysis.commonFeatures.length > 0 && (
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
            <h3 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
              <Layers size={18} />
              Common Features ({analysis.commonFeatures.length})
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {analysis.commonFeatures.map((feature, idx) => (
                <li key={idx} className="flex items-start text-sm text-purple-800">
                  <CheckCircle2 size={14} className="mr-2 mt-0.5 text-purple-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Disease cards grid */}
        <div className={`grid gap-6 ${
          selectedForCompare.length === 1 ? 'grid-cols-1 max-w-xl mx-auto' :
          selectedForCompare.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
          selectedForCompare.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
        }`}>
          {selectedForCompare.map((item, idx) => (
            <div key={item.id} className={`border-2 rounded-lg p-5 ${getPrognosisColor(item.prognosis)} relative`}>
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                {idx + 1}
              </div>

              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2">
                  <span className="text-xs font-bold uppercase tracking-wide opacity-70 bg-white/50 px-2 py-1 rounded">
                    {item.category.toUpperCase()}
                  </span>
                  <span className={`text-xs font-bold uppercase tracking-wide px-2 py-1 rounded ${
                    item.prognosis === 'good' ? 'bg-green-500 text-white' :
                    item.prognosis === 'poor' ? 'bg-red-500 text-white' :
                    item.prognosis === 'intermediate' ? 'bg-yellow-500 text-white' :
                    'bg-gray-500 text-white'
                  }`}>
                    {item.prognosis || 'N/A'}
                  </span>
                </div>
                <button
                  onClick={() => toggleCompareSelection(item.disease, item.category, item.prognosis)}
                  className="p-1.5 hover:bg-white/50 rounded-full transition-colors"
                  title="Remove from comparison"
                >
                  <X size={18} />
                </button>
              </div>

              <h3 className="font-bold text-xl mb-2">{item.disease.name}</h3>
              <p className="font-mono text-sm font-semibold mb-4 bg-white/30 px-2 py-1 rounded inline-block">
                {item.disease.gene}
              </p>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm flex items-center gap-1">
                  <Target size={14} />
                  Key Features:
                </h4>
                <ul className="space-y-1.5 text-sm">
                  {item.disease.features.map((feature, fidx) => {
                    const isUnique = analysis?.uniqueFeatures[idx]?.includes(feature);
                    return (
                      <li key={fidx} className={`flex items-start ${isUnique ? 'font-semibold' : ''}`}>
                        <span className={`mr-2 ${isUnique ? 'text-blue-600' : ''}`}>
                          {isUnique ? '★' : '•'}
                        </span>
                        <span>{feature}</span>
                        {isUnique && (
                          <span className="ml-1 text-xs bg-blue-200 text-blue-800 px-1 rounded">unique</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (compareMode) {
      return renderComparisonView();
    }

    const currentData = filteredDiseases[activeTab];

    if (!currentData || Object.keys(currentData).length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          {showFavorites ? (
            <>
              <Star size={64} className="mx-auto mb-4 text-gray-300" />
              <p className="text-xl mb-2">No favorites in this category</p>
              <p>Star diseases to add them to your favorites</p>
            </>
          ) : (
            <>
              <Search size={64} className="mx-auto mb-4 text-gray-300" />
              <p className="text-xl mb-2">No results found{searchTerm ? ` for "${searchTerm}"` : ''}</p>
              <p>Try different search terms or filters</p>
            </>
          )}
        </div>
      );
    }

    // Render based on category
    const renderSection = (title, data, prognosis, colorClass) => {
      if (!data || data.length === 0) return null;
      return (
        <div className="mb-6">
          <h2 className={`text-xl font-bold mb-3 ${colorClass} border-b-2 pb-2`}>
            {title}
          </h2>
          {data.map((disease, idx) => renderDiseaseCard(disease, idx, prognosis, activeTab))}
        </div>
      );
    };

    switch(activeTab) {
      case 'aml':
        return (
          <>
            {renderSection('Good Prognosis', currentData.good, 'good', 'text-green-700 border-green-300')}
            {renderSection('Intermediate Prognosis', currentData.intermediate, 'intermediate', 'text-yellow-700 border-yellow-300')}
            {renderSection('Poor Prognosis', currentData.poor, 'poor', 'text-red-700 border-red-300')}
          </>
        );
      case 'mds':
        return (
          <>
            {renderSection('Cytogenetics', currentData.cytogenetics, 'cytogenetics', 'text-blue-700 border-blue-300')}
            {renderSection('Mutations', currentData.mutations, 'mutations', 'text-purple-700 border-purple-300')}
          </>
        );
      case 'mpn':
        return (
          <>
            {renderSection('CML', currentData.cml, 'cml', 'text-blue-700 border-blue-300')}
            {renderSection('Polycythemia Vera', currentData.pv, 'pv', 'text-red-700 border-red-300')}
            {renderSection('ET / Primary Myelofibrosis', currentData.etpmf, 'etpmf', 'text-orange-700 border-orange-300')}
            {renderSection('Chronic Neutrophilic Leukemia', currentData.cnl, 'cnl', 'text-green-700 border-green-300')}
            {renderSection('Mastocytosis', currentData.mastocytosis, 'mastocytosis', 'text-pink-700 border-pink-300')}
          </>
        );
      case 'bcell':
        return (
          <>
            {renderSection('B-Lymphoblastic Leukemia', currentData.all, 'all', 'text-blue-700 border-blue-300')}
            {renderSection('B-cell Lymphomas', currentData.lymphomas, 'lymphomas', 'text-purple-700 border-purple-300')}
          </>
        );
      case 'tcell':
        return (
          <>
            {renderSection('T-Lymphoblastic Leukemia', currentData.all, 'all', 'text-purple-700 border-purple-300')}
            {renderSection('T-cell Lymphomas', currentData.lymphomas, 'lymphomas', 'text-indigo-700 border-indigo-300')}
          </>
        );
      case 'other':
        return (
          <>
            {Object.keys(currentData).map(subcategory =>
              renderSection(subcategory.toUpperCase(), currentData[subcategory], subcategory, 'text-gray-700 border-gray-300')
            )}
          </>
        );
      default:
        return null;
    }
  };

  // ============= MAIN RENDER =============
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Microscope size={40} />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">Haematopathology Reference</h1>
                <p className="text-blue-100">Interactive Molecular & Cytogenetic Guide</p>
                <p className="text-xs text-blue-200 mt-1">By Dr Abdul Mannan FRCPath FCPS | Blood🩸Doctor</p>
                <p className="text-xs text-blue-200/70">Based on AMP Guidelines | Revised July 2025</p>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 flex items-center gap-2 transition-colors"
              >
                <Info size={20} />
                About
              </button>

              <div className="relative" ref={exportMenuRef}>
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  disabled={favorites.length === 0}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                    favorites.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-400'
                  }`}
                >
                  <Download size={20} />
                  Export
                </button>

                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border-2 border-gray-200 z-30">
                    <div className="p-2">
                      <button onClick={exportAsJSON} className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded flex items-center gap-3 text-gray-700">
                        <Download size={18} />
                        <div>
                          <div className="font-semibold">Export as JSON</div>
                          <div className="text-xs text-gray-500">Re-importable format</div>
                        </div>
                      </button>
                      <button onClick={exportAsText} className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded flex items-center gap-3 text-gray-700">
                        <FileText size={18} />
                        <div>
                          <div className="font-semibold">Export as Text</div>
                          <div className="text-xs text-gray-500">Plain text format</div>
                        </div>
                      </button>
                      <button onClick={copyShareableText} className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded flex items-center gap-3 text-gray-700">
                        <Share2 size={18} />
                        <div>
                          <div className="font-semibold">Copy to Clipboard</div>
                          <div className="text-xs text-gray-500">For WhatsApp/Email</div>
                        </div>
                      </button>
                      <div className="border-t my-2"></div>
                      <button onClick={() => fileInputRef.current?.click()} className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded flex items-center gap-3 text-gray-700">
                        <Upload size={18} />
                        <div>
                          <div className="font-semibold">Import JSON</div>
                          <div className="text-xs text-gray-500">Load favorites from file</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                <input ref={fileInputRef} type="file" accept=".json" onChange={importFromJSON} className="hidden" />
              </div>

              <button
                onClick={() => {
                  setCompareMode(!compareMode);
                  if (compareMode) setSelectedForCompare([]);
                }}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  compareMode ? 'bg-white text-blue-600' : 'bg-blue-500 hover:bg-blue-400'
                }`}
              >
                <GitCompare size={20} />
                {compareMode ? `Compare (${selectedForCompare.length})` : 'Compare'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      {showInfo && (
        <div className="bg-blue-50 border-b border-blue-200 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-start">
              <div className="flex gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <BookOpen className="text-blue-600" size={24} />
                  <div>
                    <p className="font-semibold text-blue-900">{totalDiseases} Entities</p>
                    <p className="text-sm text-blue-700">Comprehensive database</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-500" size={24} />
                  <div>
                    <p className="font-semibold text-blue-900">{favorites.length} Favorites</p>
                    <p className="text-sm text-blue-700">Personal collection</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <GitCompare className="text-purple-600" size={24} />
                  <div>
                    <p className="font-semibold text-blue-900">Compare Mode</p>
                    <p className="text-sm text-blue-700">Side-by-side analysis</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setShowInfo(false)} className="text-blue-600 hover:text-blue-800">
                <X size={24} />
              </button>
            </div>
            <p className="mt-4 text-sm text-blue-800">
              This reference tool provides molecular and cytogenetic information for haematological malignancies
              based on the Association for Molecular Pathology (AMP) guidelines.
            </p>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white border-b shadow-sm p-4">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search diseases, genes, or features..."
              className="w-full pl-10 pr-40 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowFavorites(false);
              }}
            />

            {searchTerm && (
              <span className="absolute right-32 top-3 text-sm text-gray-500">
                {searchResultsCount} result{searchResultsCount !== 1 ? 's' : ''}
              </span>
            )}

            <div className="absolute right-2 top-1.5 flex gap-2">
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="p-1.5 hover:bg-gray-100 rounded-lg"
                >
                  <X size={18} className="text-gray-400" />
                </button>
              )}
              <button
                onClick={() => {
                  setShowFavorites(!showFavorites);
                  if (!showFavorites) setSearchTerm('');
                }}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors ${
                  showFavorites ? 'bg-yellow-400 text-white' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <Star size={16} fill={showFavorites ? 'white' : 'none'} />
                <span className="text-sm font-medium">{favorites.length}</span>
              </button>
              <button
                onClick={() => setShowRecent(!showRecent)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  showRecent ? 'bg-gray-400 text-white' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <Clock size={16} />
              </button>
            </div>

            {/* Recent Searches */}
            {showRecent && recentSearches.length > 0 && (
              <div className="absolute top-full left-0 mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-3 z-30 w-80">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-sm">Recent Searches</h3>
                  <button onClick={clearRecentSearches} className="text-xs text-red-600 hover:text-red-800">
                    Clear all
                  </button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((term, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSearchTerm(term);
                        setShowRecent(false);
                        setShowFavorites(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm flex items-center gap-2"
                    >
                      <Clock size={14} className="text-gray-400" />
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              <select
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All Fields</option>
                <option value="name">Disease Name</option>
                <option value="gene">Gene/Mutation</option>
                <option value="features">Features</option>
              </select>
            </div>

            <select
              value={prognosisFilter}
              onChange={(e) => setPrognosisFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Prognosis</option>
              <option value="good">Good Prognosis</option>
              <option value="intermediate">Intermediate</option>
              <option value="poor">Poor Prognosis</option>
            </select>

            <button
              onClick={() => setGlobalSearch(!globalSearch)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                globalSearch ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Zap size={14} />
              {globalSearch ? 'All Categories' : 'Current Tab'}
            </button>

            <div className="h-6 w-px bg-gray-300 mx-1"></div>

            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-xs text-gray-500 mr-1">Quick:</span>
              {quickSearchTerms.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSearchTerm(item.term);
                    setShowFavorites(false);
                  }}
                  className="px-2 py-1 text-xs bg-gray-100 hover:bg-blue-100 hover:text-blue-700 rounded transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {(searchFilter !== 'all' || prognosisFilter !== 'all' || globalSearch) && (
              <button
                onClick={() => {
                  setSearchFilter('all');
                  setPrognosisFilter('all');
                  setGlobalSearch(false);
                }}
                className="text-xs text-red-600 hover:text-red-800 ml-2"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      {!compareMode && (
        <div className="bg-white border-b shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex overflow-x-auto">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`px-6 py-4 font-semibold whitespace-nowrap transition-colors ${
                    activeTab === cat.id
                      ? 'border-b-4 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-2">{cat.icon}</span>
                  {cat.label}
                  <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                    {getCategoryStats(cat.id)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {renderContent()}
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-gray-300 p-6 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Microscope size={24} />
            <span className="font-bold text-white">Haematopathology Reference</span>
          </div>
          <p className="text-sm">
            Clinical reference tool for professional use only. Not for diagnostic purposes.
          </p>
          <p className="text-xs mt-2 text-gray-400">
            Content from Association for Molecular Pathology (AMP) • Revised July 2025
          </p>
          <p className="text-xs mt-2 text-gray-500">
            {favorites.length} favorites saved • {recentSearches.length} recent searches • {totalDiseases} total entities
          </p>
          <div className="mt-6 pt-4 border-t border-gray-700">
            <p className="text-sm font-semibold text-white">
              By Dr Abdul Mannan FRCPath FCPS | Blood🩸Doctor
            </p>
            <a
              href="mailto:blooddoctor.co@gmail.com"
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              blooddoctor.co@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HaematopathologyReference;
