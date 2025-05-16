import {
    Apple, ChevronDown, ChevronRight, Headphones, Laptop, Monitor, Phone, Tablet
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProductStore } from '../../apis/Product';

type SubCategory = { name: string; path: string; }
type Category = { name: string; icon: React.ElementType; subcategories?: SubCategory[] }

type SidebarProps = {
    isOpen: boolean;
    topOffset?: number;
    widthClass?: string;
};

const Sidebar: React.FC<SidebarProps> = ({
    isOpen,
    topOffset = 0,
    widthClass = 'w-60'
}) => {
    const [openCategoryIndex, setOpenCategoryIndex] = useState<number | null>(null);
    const location = useLocation();
    const { pathname } = location;
    const navigate = useNavigate();
    const getSearchProducts = useProductStore(state => state.getSearchProducts);

    const categories: Category[] = [
        {
            name: 'Laptop', icon: Laptop,
            subcategories: [
                { name: 'Laptop Acer', path: '/laptop/acer' },
                { name: 'Laptop Asus', path: '/laptop/asus' },
                { name: 'Laptop Dell', path: '/laptop/dell' },
                { name: 'Laptop Hp', path: '/laptop/hp' },
                { name: 'Laptop Lenovo', path: '/laptop/lenovo' },
            ]
        },
        {
            name: 'Apple', icon: Apple,
            subcategories: [
                { name: 'Macbook Air', path: '/apple/macAir' },
                { name: 'Macbook Pro', path: '/apple/macpro' },
                { name: 'Ipad', path: '/apple/ipad' },
                { name: 'Iphone', path: '/apple/iphone' },
            ]
        },
        { name: 'Tablet', icon: Tablet },
        {
            name: 'Điện thoại', icon: Phone,
            subcategories: [
                { name: 'Xiaomi', path: '/phone/xiaomi' },
                { name: 'Samsung', path: '/phone/samsung' },
            ]
        },
        { name: 'Màn hình', icon: Monitor },
        {
            name: 'Phụ kiện', icon: Headphones,
            subcategories: [
                { name: 'Chuột', path: '/accessories/mouse' },
                { name: 'Bàn phím', path: '/accessories/keyboard' },
                { name: 'Tai nghe', path: '/accessories/headphone' },
            ]
        },
    ];

    useEffect(() => {
        const activeParentIndex = categories.findIndex(category =>
            category.subcategories?.some(sub => pathname.includes(sub.path))
        );
        if (activeParentIndex !== -1) {
            setOpenCategoryIndex(activeParentIndex);
        }
    }, [pathname]);

    const handleSearchAndNavigate = async (keyword: string) => {
        await getSearchProducts(keyword);
        navigate(`/search?q=${encodeURIComponent(keyword)}`);
    };

    const handleCategoryToggle = (index: number) => {
        setOpenCategoryIndex(prev => (prev === index ? null : index));
    };

    const baseLinkClasses = "flex justify-between items-center p-3 text-sm transition-colors duration-150 w-full";
    const iconBaseClasses = "mr-3 flex-shrink-0";
    const activeClasses = "bg-red-50 text-red-600 font-semibold";
    const inactiveClasses = "text-gray-700 hover:bg-gray-100";

    const subLinkBaseClasses = "flex items-center py-2 px-3 pl-12 text-xs transition-colors duration-150 w-full";
    const activeSubLinkClasses = "bg-red-50 text-red-600 font-medium";
    const inactiveSubLinkClasses = "text-gray-600 hover:bg-gray-100";

    return (
        <div
            className={`
                fixed left-0 ${widthClass} bg-white border-r border-gray-200 shadow-lg  
                transform transition-transform duration-300 ease-in-out z-40 
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
            style={{ top: `${topOffset}px`, height: `calc(100vh - ${topOffset}px)` }}
            aria-hidden={!isOpen}
        >
            <div className='w-full h-full overflow-y-auto'>
                <ul className="py-2">
                    {categories.map((category, index) => {
                        const hasSubcategories = category.subcategories && category.subcategories.length > 0;
                        const isParentOfActiveSub = hasSubcategories && category.subcategories.some(sub => pathname.includes(sub.path));
                        const isDirectActive = !hasSubcategories && pathname.toLowerCase().includes(category.name.toLowerCase());

                        return (
                            <li key={category.name} className="border-b border-gray-100 last:border-b-0">
                                {hasSubcategories ? (
                                    <div>
                                        <button
                                            onClick={() => handleCategoryToggle(index)}
                                            className={`${baseLinkClasses} ${isParentOfActiveSub ? activeClasses : inactiveClasses}`}
                                            aria-expanded={openCategoryIndex === index}
                                        >
                                            <div className='flex items-center'>
                                                <category.icon size={18} className={`${iconBaseClasses} ${isParentOfActiveSub ? 'text-red-600' : 'text-red-500'}`} />
                                                <span>{category.name}</span>
                                            </div>
                                            {openCategoryIndex === index ? (
                                                <ChevronDown size={16} className={`flex-shrink-0 ${isParentOfActiveSub ? 'text-red-500' : 'text-gray-400'}`} />
                                            ) : (
                                                <ChevronRight size={16} className={`flex-shrink-0 ${isParentOfActiveSub ? 'text-red-500' : 'text-gray-400'}`} />
                                            )}
                                        </button>
                                        {openCategoryIndex === index && (
                                            <ul className='py-1 bg-gray-50'>
                                                {category.subcategories!.map(sub => {
                                                    const isSubActive = pathname.includes(sub.path);
                                                    return (
                                                        <li key={sub.name}>
                                                            <button
                                                                onClick={() => handleSearchAndNavigate(sub.name)}
                                                                className={`${subLinkBaseClasses} ${isSubActive ? activeSubLinkClasses : inactiveSubLinkClasses}`}
                                                            >
                                                                {sub.name}
                                                            </button>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleSearchAndNavigate(category.name)}
                                        className={`${baseLinkClasses} ${isDirectActive ? activeClasses : inactiveClasses}`}
                                    >
                                        <div className='flex items-center'>
                                            <category.icon size={18} className={`${iconBaseClasses} ${isDirectActive ? 'text-red-600' : 'text-red-500'}`} />
                                            <span>{category.name}</span>
                                        </div>
                                    </button>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
