import {
    Apple,
    ChevronDown,
    ChevronRight,
    Headphones,
    Laptop,
    Monitor,
    Phone,
    Tablet
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProductStore } from '../stores/productStore';

type SubCategory = { name: string; path: string; };
type Category = {
    name: string;
    icon: React.ElementType;
    path?: string;
    subcategories?: SubCategory[];
};

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
    const navigate = useNavigate();
    const { pathname } = location;

    const getSearchProducts = useProductStore(state => state.getSearchProducts);

    useEffect(() => {
        const activeParentIndex = categories.findIndex(category =>
            category.subcategories?.some(sub => sub.path === pathname)
        );
        if (activeParentIndex !== -1) {
            setOpenCategoryIndex(activeParentIndex);
        }
    }, [pathname]);

    const handleCategoryToggle = (index: number) => {
        setOpenCategoryIndex(prevIndex => (prevIndex === index ? null : index));
    };

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
        { name: 'Tablet', path: '/tablet', icon: Tablet },
        {
            name: 'Điện thoại', icon: Phone,
            subcategories: [
                { name: 'Xiaomi', path: '/phone/xiaomi' },
                { name: 'Samsung', path: '/phone/samsung' },
            ]
        },
        { name: 'Màn hình', path: '/screen', icon: Monitor },
        {
            name: 'Phụ kiện', icon: Headphones,
            subcategories: [
                { name: 'Chuột', path: '/accessories/mouse' },
                { name: 'Bàn phím', path: '/accessories/keyboard' },
                { name: 'Tai nghe', path: '/accessories/headphone' },
            ]
        },
    ];

    const baseLinkClasses = "flex justify-between items-center p-3 text-sm transition-colors duration-150 w-full";
    const iconBaseClasses = "mr-3 flex-shrink-0";
    const activeClasses = "bg-red-50 text-red-600 font-semibold";
    const inactiveClasses = "text-gray-700 hover:bg-gray-100";
    const defaultIconColor = "text-red-500";
    const activeIconColor = "text-red-600";
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
                        const isParentOfActiveSub = hasSubcategories && category.subcategories.some(sub => sub.path === pathname);
                        const isDirectLinkActive = !hasSubcategories && category.path === pathname;
                        const isCategoryEffectivelyActive = isParentOfActiveSub || isDirectLinkActive;

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
                                                {category.icon && (
                                                    <category.icon
                                                        size={18}
                                                        className={`${iconBaseClasses} ${isParentOfActiveSub ? activeIconColor : defaultIconColor}`}
                                                    />
                                                )}
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
                                                {category.subcategories.map(subCategory => {
                                                    const keyword = subCategory.name.split(' ').pop() || '';
                                                    return (
                                                        <li key={subCategory.path}>
                                                            <button
                                                                onClick={() => {
                                                                    getSearchProducts(keyword);
                                                                    navigate(`/search?q=${encodeURIComponent(keyword)}`);
                                                                }}
                                                                className={`${subLinkBaseClasses} ${pathname.includes(keyword.toLowerCase()) ? activeSubLinkClasses : inactiveSubLinkClasses}`}
                                                            >
                                                                <span>{subCategory.name}</span>
                                                            </button>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            if (category.path) {
                                                navigate(category.path);
                                            }
                                        }}
                                        className={`${baseLinkClasses} ${isDirectLinkActive ? activeClasses : inactiveClasses}`}
                                    >
                                        <div className='flex items-center'>
                                            {category.icon && (
                                                <category.icon
                                                    size={18}
                                                    className={`${iconBaseClasses} ${isDirectLinkActive ? activeIconColor : defaultIconColor}`}
                                                />
                                            )}
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
