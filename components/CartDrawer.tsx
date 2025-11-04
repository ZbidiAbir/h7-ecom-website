"use client";

import { useCart } from "@/app/hooks/useCart";
import { Button } from "@/components/ui/button";
import { ShoppingCart, X, Minus, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const router = useRouter();

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const handleCheckout = () => {
    onClose();
    router.push("/checkout");
  };

  const handleIncrease = (id: string, current: number, stock: number) => {
    if (current >= stock) {
      toast.warning("Maximum stock reached!");
      return;
    }
    updateQuantity(id, current + 1);
  };

  const handleDecrease = (id: string, current: number) => {
    if (current > 1) updateQuantity(id, current - 1);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 w-full sm:w-96 h-full bg-white shadow-xl transform transition-transform duration-300 z-50 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Enhanced Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
              <p className="text-sm text-gray-500">
                {cart.length} item{cart.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Cart is empty
              </h3>
              <p className="text-gray-500 mb-6">Add items to start shopping</p>
              <Button
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-shadow"
                >
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {(Number(item.price) * item.quantity).toFixed(3)}DT
                    </p>
                    {item.colors?.map((c, idx) => {
                      const color = typeof c === "string" ? c : c.color;
                      return (
                        <span
                          key={`${color}-${idx}`}
                          className="inline-block w-4 h-4 rounded-full border mr-1"
                          style={{ backgroundColor: color }}
                        />
                      );
                    })}
                    {item.sizes?.map((c, idx) => {
                      const size = typeof c === "string" ? c : c.size;
                      return <div className="capitalize">{size}</div>;
                    })}

                    {/* Enhanced Quantity Controller */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 rounded-full"
                          onClick={() => handleDecrease(item.id, item.quantity)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>

                        <span className="w-8 text-center text-sm font-medium text-gray-900">
                          {item.quantity}
                        </span>

                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 rounded-full"
                          onClick={() =>
                            handleIncrease(item.id, item.quantity, item.stock)
                          }
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-500">
                        {item.price.toFixed(3)}DT × {item.quantity}
                      </p>
                      <p className="text-xs text-gray-500">
                        Stock: {item.stock}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Footer */}
        {cart.length > 0 && (
          <div className="border-t bg-gray-50 p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                <span>Total</span>
                <span className="text-2xl text-gray-600">
                  {isNaN(total) ? "0.00" : total.toFixed(3)}DT
                </span>
              </div>

              <p className="text-sm text-gray-500 text-center">
                Shipping and taxes calculated at checkout
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleCheckout}
                className="w-full h-12 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold text-base rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Proceed to Checkout
              </Button>

              <Button
                onClick={clearCart}
                variant="outline"
                className="w-full h-11 text-gray-700 border-gray-300 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors rounded-xl"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Cart
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
