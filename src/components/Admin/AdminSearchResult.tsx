import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useProductStore } from '../../apis/Product';
import { Edit, Trash2 } from 'lucide-react';

const AdminSearchResult: React.FC = () => {
    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get('q') || '';
    const { searchResults, loading, error, getSearchProducts, delProduct } = useProductStore();
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (searchTerm) {
            getSearchProducts(searchTerm);
        }
    }, [searchTerm, getSearchProducts]);

    const handleDelete = async (productId: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            try {
                setIsDeleting(productId);
                await delProduct(productId);
                // Refresh search results after deletion
                if (searchTerm) {
                    await getSearchProducts(searchTerm);
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Có lỗi xảy ra khi xóa sản phẩm');
            } finally {
                setIsDeleting(null);
            }
        }
    };

    const handleEdit = (productId: string) => {
        navigate(`/admin/products/edit/${productId}`);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Lỗi!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Kết quả tìm kiếm cho "{searchTerm}"
                </h1>
                <Link
                    to="/admin/products/add"
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                    Thêm sản phẩm mới
                </Link>
            </div>

            {searchResults.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-600 text-lg">Không tìm thấy sản phẩm nào phù hợp.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {searchResults.map((product) => {
                        const productId = product._id;
                        if (!productId) return null;
                        
                        return (
                            <div
                                key={productId}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border-2 border-gray-500"
                            >
                                <div className="aspect-w-1 aspect-h-1 w-full">
                                    <img
                                        src={product.image || '/placeholder.png'}
                                        alt={product.productName}
                                        className="w-full h-48 object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                                        {product.productName}
                                    </h3>
                                    <p className="text-green-600 font-bold">
                                        {product.price.toLocaleString('vi-VN')}đ
                                    </p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Mã SP: {product.MaSP}
                                    </p>
                                    <div className="flex justify-end space-x-2 mt-4">
                                        <button
                                            onClick={() => handleEdit(productId)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                            title="Chỉnh sửa sản phẩm"
                                        >
                                            <Edit size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(productId)}
                                            disabled={isDeleting === productId}
                                            className={`p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors ${
                                                isDeleting === productId ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                            title="Xóa sản phẩm"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AdminSearchResult; 