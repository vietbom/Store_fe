import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProductStore } from '../../apis/Product';
import { Link } from 'react-router-dom';

const SearchResult: React.FC = () => {
    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get('q') || '';
    const { searchResults, loading, error, getSearchProducts } = useProductStore();

    useEffect(() => {
        if (searchTerm) {
            getSearchProducts(searchTerm);
        }
    }, [searchTerm, getSearchProducts]);

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
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Kết quả tìm kiếm cho "{searchTerm}"
            </h1>

            {searchResults.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-600 text-lg">Không tìm thấy sản phẩm nào phù hợp.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {searchResults.map((product) => (
                        <Link
                            key={product._id}
                            to={`/products/${product._id}`}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
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
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchResult;
