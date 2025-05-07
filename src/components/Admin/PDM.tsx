//product data managerment ~ PDM.tsx
import React, { useEffect, useState } from 'react';
import { useProductStore } from '../../apis/Product';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

interface ProductFormData {
    _id?: string;
    MaSP: string;
    productName: string;
    price: string;
    SoLuong: string;
    type: string;
    details: string;
    image?: string;
}

const initialFormState: ProductFormData = {
    MaSP: '',
    productName: '',
    price: '',
    SoLuong: '',
    type: '',
    details: '',
    image: ''
};

const PDM = () => {
    const { products, loading, error, getAllProducts, addProduct, updateProduct, delProduct } = useProductStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<ProductFormData | null>(null);
    const [formData, setFormData] = useState<ProductFormData>(initialFormState);

    useEffect(() => {
        getAllProducts();
    }, [getAllProducts]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const productData = {
                ...formData,
                price: Number(formData.price) || 0,
                SoLuong: Number(formData.SoLuong) || 0
            };

            if (isEditing && currentProduct?._id) {
                await updateProduct(currentProduct._id, productData);
            } else {
                await addProduct(productData);
            }
            setIsModalOpen(false);
            setFormData(initialFormState);
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    const handleEdit = (product: any) => {
        setCurrentProduct(product);
        setFormData({
            _id: product._id,
            MaSP: product.MaSP,
            productName: product.productName,
            price: product.price.toString(),
            SoLuong: product.SoLuong.toString(),
            type: product.type || '',
            details: product.details || '',
            image: product.image || ''
        });
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
                {products.map((product) => (
                    <div key={product._id} className="border rounded-lg p-4 shadow-sm">
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

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">
                            {isEditing ? 'Chỉnh sửa thiết bị' : 'Thêm thiết bị mới'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                <label className="block text-sm font-medium text-gray-700">Loại</label>
                                <input
                                    type="text"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
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
