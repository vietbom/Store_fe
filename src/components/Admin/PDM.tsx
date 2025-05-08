//product data managerment ~ PDM.tsx
import React, { useEffect, useState } from 'react';
import { useProductStore } from '../../apis/Product';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { Product } from '../../apis/Product';
import ProductSpecForm from './ProductSpecForm';
import { useParams } from 'react-router-dom';

interface SpecType {
    general: {
        manufacturer?: string;
        model?: string;
        releaseYear?: string;
        color?: string[];
        material?: string;
        warranty?: string;
    };
    display: {
        size?: string;
        resolution?: string;
        panelType?: string;
        refreshRate?: string;
        brightness?: string;
        colorGamut?: string;
        features?: string[];
    };
    processor: {
        brand?: string;
        series?: string;
        modelName?: string;
        cores?: string;
        threads?: string;
        cache?: string;
    };
    ram: {
        type: {
            capacity?: string;
            type?: string;
            speed?: string;
        };
    };
    storage: {
        type: {
            type?: string;
            capacity?: string;
        };
    };
    graphics: {
        type: {
            type?: string;
            brand?: string;
            model?: string;
        };
    };
    battery: {
        capacity?: string;
        life?: string;
        charging?: string;
    };
    operatingSystem: {
        name?: string;
    };
    connectivity: {
        wifi?: string;
        bluetooth?: string;
        ports?: string[];
    };
    camera: {
        front?: string;
        rear?: string;
        features?: string[];
    };
    itemWeight: {
        weight?: string;
    };
}

interface ProductFormData {
    _id?: string;
    MaSP: string;
    productName: string;
    price: string;
    SoLuong: string;
    type: string;
    details: string;
    image?: string;
    spec?: SpecType;
}

const initialSpecState: SpecType = {
    general: {},
    display: {},
    processor: {},
    ram: { type: {} },
    storage: { type: {} },
    graphics: { type: {} },
    battery: {},
    operatingSystem: {},
    connectivity: {},
    camera: {},
    itemWeight: {}
};

const initialFormState: ProductFormData = {
    MaSP: '',
    productName: '',
    price: '',
    SoLuong: '',
    type: '',
    details: '',
    image: '',
    spec: initialSpecState
};

const PDM = () => {
    const { id } = useParams();
    const { products, loading, error, getAllProducts, addProduct, updateProduct, delProduct, getProduct } = useProductStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<ProductFormData | null>(null);
    const [formData, setFormData] = useState<ProductFormData>(initialFormState);
    const [activeTab, setActiveTab] = useState<'basic' | 'specs'>('basic');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6;

    useEffect(() => {
        getAllProducts();
    }, [getAllProducts]);

    useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                try {
                    await getProduct({ _id: id });
                    const product = products.find(p => p._id === id);
                    if (product) {
                        handleEdit(product);
                    }
                } catch (error) {
                    console.error('Error fetching product:', error);
                }
            };
            fetchProduct();
        }
    }, [id, getProduct, products]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const parts = name.split('.');
            setFormData(prev => {
                const newSpec = { ...prev.spec } as SpecType;
                
                // Handle nested structure for RAM, storage and graphics
                if (parts[0] === 'ram' || parts[0] === 'storage' || parts[0] === 'graphics') {
                    if (!newSpec[parts[0]]) {
                        newSpec[parts[0]] = { type: {} };
                    }
                    if (!newSpec[parts[0]].type) {
                        newSpec[parts[0]].type = {};
                    }
                    newSpec[parts[0]].type[parts[2]] = value;
                } else {
                    // Handle other fields
                    if (!newSpec[parts[0]]) {
                        newSpec[parts[0]] = {};
                    }
                    newSpec[parts[0]][parts[1]] = value;
                }
                
                return {
                    ...prev,
                    spec: newSpec
                };
            });
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleArrayInputChange = (section: string, field: string, value: string) => {
        setFormData(prev => {
            const newSpec = { ...prev.spec } as SpecType;
            if (!newSpec[section]) {
                newSpec[section] = {};
            }
            newSpec[section][field] = value.split(',').map(item => item.trim());
            return {
                ...prev,
                spec: newSpec
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Format the data before sending
            const formattedSpec = formData.spec ? {
                general: {
                    ...formData.spec.general,
                    releaseYear: formData.spec.general?.releaseYear?.toString() || undefined,
                },
                display: formData.spec.display,
                processor: {
                    ...formData.spec.processor,
                    cores: formData.spec.processor?.cores?.toString() || undefined,
                    threads: formData.spec.processor?.threads?.toString() || undefined,
                },
                ram: {
                    type: {
                        capacity: formData.spec.ram?.type?.capacity || undefined,
                        type: formData.spec.ram?.type?.type || undefined,
                        speed: formData.spec.ram?.type?.speed || undefined,
                    }
                },
                storage: {
                    type: {
                        type: formData.spec.storage?.type?.type || undefined,
                        capacity: formData.spec.storage?.type?.capacity || undefined,
                    }
                },
                graphics: {
                    type: {
                        type: formData.spec.graphics?.type?.type || undefined,
                        brand: formData.spec.graphics?.type?.brand || undefined,
                        model: formData.spec.graphics?.type?.model || undefined,
                    }
                },
                battery: formData.spec.battery,
                operatingSystem: formData.spec.operatingSystem,
                connectivity: {
                    ...formData.spec.connectivity,
                    ports: formData.spec.connectivity?.ports || [],
                },
                camera: {
                    ...formData.spec.camera,
                    features: formData.spec.camera?.features || [],
                },
                itemWeight: formData.spec.itemWeight,
            } : undefined;

            const productData = {
                ...formData,
                price: Number(formData.price) || 0,
                SoLuong: Number(formData.SoLuong) || 0,
                spec: formattedSpec
            };

            if (isEditing && currentProduct?._id) {
                await updateProduct(currentProduct._id, productData);
            } else {
                await addProduct(productData);
            }

            setIsEditing(false);
            setCurrentProduct(null);
            setFormData(initialFormState);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error submitting product:', error);
        }
    };

    const handleEdit = (product: Product) => {
        const formData: ProductFormData = {
            _id: product._id,
            MaSP: product.MaSP,
            productName: product.productName,
            price: product.price.toString(),
            SoLuong: product.SoLuong.toString(),
            type: product.type,
            details: product.details,
            image: product.image,
            spec: product.spec ? {
                ...product.spec,
                general: {
                    ...product.spec.general,
                    releaseYear: product.spec.general?.releaseYear?.toString(),
                },
                processor: {
                    ...product.spec.processor,
                    cores: product.spec.processor?.cores?.toString(),
                    threads: product.spec.processor?.threads?.toString(),
                },
                ram: {
                    type: {
                        capacity: product.spec.ram?.type?.capacity || '',
                        type: product.spec.ram?.type?.type || '',
                        speed: product.spec.ram?.type?.speed || '',
                    }
                },
                storage: {
                    type: {
                        type: product.spec.storage?.type?.type || '',
                        capacity: product.spec.storage?.type?.capacity || '',
                    }
                },
                graphics: {
                    type: {
                        type: product.spec.graphics?.type?.type || '',
                        brand: product.spec.graphics?.type?.brand || '',
                        model: product.spec.graphics?.type?.model || '',
                    }
                }
            } : initialSpecState
        };
        setCurrentProduct(formData);
        setFormData(formData);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            await delProduct(id);
        }
    };

    const handleAddNew = () => {
        setIsEditing(false);
        setCurrentProduct(null);
        setFormData(initialFormState);
        setIsModalOpen(true);
    };

    const productTypes = [
        { value: '', label: 'Chọn loại sản phẩm...' },
        { value: 'Laptop', label: 'Máy tính' },
        { value: 'Apple', label: 'Apple' },
        { value: 'Tablet', label: 'Máy tính bảng Tablet ' },
        { value: 'Phone', label: 'Điện thoại' },
        { value: 'Screen', label: 'Màn hình' },
        { value: 'Accessories', label: 'Phụ kiện' },
    ];

    // Calculate pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / productsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    if (loading) return <div className="text-center p-4">Đang tải...</div>;
    if (error) return <div className="text-red-500 p-4">{error}</div>;

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Quản lý thiết bị điện tử</h1>
                <button
                    onClick={handleAddNew}
                    className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                    <FaPlus /> Thêm thiết bị
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentProducts.map((product) => (
                    <div key={product._id} className="border-2 border-gray-500 rounded-lg p-4 shadow-sm">
                        {product.image && (
                            <img
                                src={product.image}
                                alt={product.productName}
                                className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                        )}
                        <h3 className="font-bold">{product.productName}</h3>
                        <p className="text-gray-600">Mã SP: {product.MaSP}</p>
                        <p className="text-gray-600">Giá: {product.price}đ</p>
                        <p className="text-gray-600">Số lượng: {product.SoLuong}</p>
                        <p className="text-gray-600">Loại: {product.type}</p>
                        <div className="mt-4 flex gap-2">
                            <button
                                onClick={() => handleEdit(product)}
                                className="bg-yellow-500 text-white px-3 py-1 rounded flex items-center gap-1"
                            >
                                <FaEdit /> Sửa
                            </button>
                            <button
                                onClick={() => handleDelete(product._id!)}
                                className="bg-red-500 text-white px-3 py-1 rounded flex items-center gap-1"
                            >
                                <FaTrash /> Xóa
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded border disabled:opacity-50"
                    >
                        Trước
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-3 py-1 rounded border ${
                                currentPage === index + 1
                                    ? 'bg-blue-500 text-white'
                                    : 'hover:bg-gray-100'
                            }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded border disabled:opacity-50"
                    >
                        Sau
                    </button>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-200 p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto mt-16">
                        <h2 className="text-xl font-bold mb-4">
                            {isEditing ? 'Chỉnh sửa thiết bị' : 'Thêm thiết bị mới'}
                        </h2>
                        
                        <div className="flex gap-4 mb-4">
                            <button
                                onClick={() => setActiveTab('basic')}
                                className={`px-4 py-2 rounded ${activeTab === 'basic' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                            >
                                Thông tin cơ bản
                            </button>
                            <button
                                onClick={() => setActiveTab('specs')}
                                className={`px-4 py-2 rounded ${activeTab === 'specs' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                            >
                                Thông số kỹ thuật
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {activeTab === 'basic' ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Mã sản phẩm</label>
                                        <input
                                            type="text"
                                            name="MaSP"
                                            value={formData.MaSP}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
                                        <input
                                            type="text"
                                            name="productName"
                                            value={formData.productName}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Giá</label>
                                        <input
                                            type="text"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Số lượng</label>
                                        <input
                                            type="text"
                                            name="SoLuong"
                                            value={formData.SoLuong}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor='type' className="block text-sm font-medium text-gray-700">Loại</label>
                                        <select
                                            id='type'
                                            name='type'
                                            value={formData.type}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3" 
                                        >
                                            {productTypes.map(typeOption => (
                                                <option key={typeOption.value} value={typeOption.value} >
                                                    {typeOption.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Chi tiết</label>
                                        <textarea
                                            name="details"
                                            value={formData.details}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            rows={3}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">URL hình ảnh</label>
                                        <input
                                            type="text"
                                            name="image"
                                            value={formData.image || ''}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-4 bg-white p-4 rounded-lg shadow">
                                    <h3 className="text-lg font-semibold border-b pb-2">Thông số kỹ thuật</h3>
                                    <ProductSpecForm
                                        spec={formData.spec || initialSpecState}
                                        onChange={handleInputChange}
                                        onArrayChange={handleArrayInputChange}
                                    />
                                </div>
                            )}

                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    {isEditing ? 'Cập nhật' : 'Thêm mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PDM;
