import { Apple, ChevronDown, ChevronRight, Headphones, Laptop, Monitor, Phone, Tablet } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

type SubCategory = { name: string; path: string; }
type Category = { name: string; icon: React.ElementType; path?: string; subcategories?: SubCategory[] }

type SidebarProps = {
    isOpen: boolean;
    topOffset?: number;
    widthClass?: string; 
}

const Sidebar: React.FC<SidebarProps> = ({
    isOpen,
    topOffset = 0,
    widthClass = 'w-60' 
}) => {
    const [openCategoryIndex, setOpenCategoryIndex] = useState<number | null>(null);
    const handleCategoryToggle = (index: number) =>{
        setOpenCategoryIndex(prevIndex => (prevIndex === index ? null : index));
    };

     const categories: Category[] = [
        { name: 'Laptop', icon: Laptop,
          subcategories: [
            {name: 'Laptop Acer', path: '/laptop/acer'}, 
            {name: 'Laptop Asus', path: '/laptop/asus'},
            {name: 'Laptop Dell', path: '/laptop/dell'},
            {name: 'Laptop Hp', path: '/laptop/hp'},
            {name: 'Laptop Lenovo', path: '/laptop/lenovo'},
          ]
        },
        { name: 'Apple', icon: Apple,
          subcategories: [
            {name: 'Macbook Air', path: '/apple/macAir'}, 
            {name: 'Macbook Pro', path: '/apple/macpro'},
            {name: 'Ipad', path: '/apple/ipad'},
            {name: 'Iphone', path: '/apple/iphone'},
          ]
        },
        { name: 'Tablet', path: '/tablet', icon: Tablet },
        { name: 'Điện thoại', icon: Phone,
          subcategories: [
            { name: 'Xiaomi', path: '/phone/xiaomi' }, 
            { name: 'Samsung', path: '/phone/samsung' },
          ]
        },
        { name: 'Màn hình', path: '/screen', icon: Monitor },
        { name: 'Phụ kiện', icon: Headphones,
          subcategories: [
            { name: 'Chuột', path: '/accessories/mouse' }, 
            { name: 'Bàn phím', path: '/accessories/keyboard' },
            { name: 'Tai nghe', path: '/accessories/headphone' },
          ]
        },
    ];

    const linkClasses = "flex justify-between items-center p-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150 w-full";
    const iconClasses = "text-red-500 mr-3 flex-shrink-0";
    const subLinkClasses = "flex items-center py-2 px-3 pl-12 text-xs text-gray-600 hover:bg-gray-100 transition-colors duration-150 w-full";

    return (
        <div
            className={
            `fixed left-0 ${widthClass} bg-white border-r border-gray-200 shadow-lg  
             transform transition-transform duration-300 ease-in-out z-50
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
            }
            style={{top: `${topOffset}px`, height: `calc(100vh - ${topOffset}px)`}}
            aria-hidden={!isOpen}
        >
            <div className='w-full h-full overflow-y-auto'> {/* Thêm h-full */}
                <ul>
                    {categories.map((category, index) => (
                        <li
                            key={category.name}
                            className="border-b border-gray-100 last:border-b-0"
                        >
                            {category.subcategories && category.subcategories.length > 0 ? (
                                // --- Accordion ---
                                <div>
                                    <button
                                        onClick={()=> handleCategoryToggle(index)}
                                        className={`${linkClasses} cursor-pointer`}
                                        aria-expanded={openCategoryIndex === index}
                                    >
                                        <div className='flex items-center'> {/* Bỏ div thừa */}
                                            {category.icon && <category.icon size={18} className={iconClasses} />}
                                            <span>{category.name}</span>
                                        </div>
                                        {openCategoryIndex === index ? (
                                            <ChevronDown size={16} className='text-gray-400 flex-shrink-0'/>
                                        ) : (
                                            <ChevronRight size={16} className='text-gray-400 flex-shrink-0'/>
                                        )}
                                    </button>
                                    {openCategoryIndex === index && (
                                        <ul className='py-1 bg-gray-50'>
                                            {category.subcategories.map(subCategory => (
                                                <li key={subCategory.path}>
                                                    <Link to={subCategory.path} className={subLinkClasses}>
                                                        <span>{subCategory.name}</span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ): (
                                // --- Link thường ---
                                <Link to={category.path || '#'} className={linkClasses}>
                                    <div className='flex items-center'>
                                        {category.icon && <category.icon size={18} className={iconClasses} />}
                                        <span>{category.name}</span>
                                    </div>
                                    <ChevronRight size={16} className='text-gray-400 flex-shrink-0'/>
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Sidebar