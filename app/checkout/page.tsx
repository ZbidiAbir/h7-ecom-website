"use client";

import React, { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/hooks/useCart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  ShoppingCart,
  MapPin,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Minus,
  Plus,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ShippingForm {
  name: string;
  address: string;
  city: string;
  zip: string;
  country: string;
}

const Checkout = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();

  const [shipping, setShipping] = useState<ShippingForm>({
    name: session?.user?.name || "",
    address: "",
    city: "",
    zip: "",
    country: "",
  });

  const [phoneNumber, setPhoneNumber] = useState(""); // ✅ Nouveau champ
  const [additionalInfo, setAdditionalInfo] = useState(""); // ✅ Nouveau champ
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") signIn();
  }, [status]);

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-64">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your session...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
    setError(null);
  };

  const handlePlaceOrder = async () => {
    if (!session || cart.length === 0) {
      setError("Your cart is empty");
      return;
    }

    if (
      !shipping.name ||
      !shipping.address ||
      !shipping.city ||
      !shipping.zip ||
      !shipping.country ||
      !phoneNumber
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const orderData = {
        userId: session.user.id,
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        shipping,
        paymentMethod: "CASH",
        phoneNumber, // ✅ ajouté
        additionalInfo, // ✅ ajouté
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error("Error creating the order");

      const createdOrder = await res.json();
      clearCart();
      setSuccess("Order created successfully!");

      setTimeout(() => {
        // router.push(`/orders/${createdOrder.id}`);
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error creating the order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingCart className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      {cart.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-4">
                Add some items before placing an order
              </p>
              <Button onClick={() => router.push("/")}>
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Your Cart ({itemCount} item{itemCount > 1 ? "s" : ""})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-3 border-b last:border-b-0"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{item.name}</h3>

                        <div className="flex items-center gap-3 mt-2">
                          {/* Quantity controls */}
                          <div className="flex items-center border rounded-lg">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1 || loading}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              min={1}
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(
                                  item.id,
                                  Math.max(1, Number(e.target.value))
                                )
                              }
                              className="w-14 h-7 text-center text-sm border-none focus-visible:ring-0"
                              disabled={loading}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              disabled={loading}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <Badge variant="secondary" className="text-xs">
                            {item.price.toFixed(2)} €
                          </Badge>

                          <span className="font-medium text-sm">
                            {(item.price * item.quantity).toFixed(2)} €
                          </span>
                        </div>
                        <div>
                          {" "}
                          {item.colors?.map((c, idx) => {
                            const color = typeof c === "string" ? c : c.color;
                            return (
                              <div className="flex items-center gap-1">
                                Color:
                                <span
                                  key={`${color}-${idx}`}
                                  className="inline-block w-4 h-4 rounded-full border mr-1"
                                  style={{ backgroundColor: color }}
                                />
                              </div>
                            );
                          })}
                          {item.sizes?.map((c, idx) => {
                            const size = typeof c === "string" ? c : c.size;
                            return (
                              <div className="capitalize"> size:{size}</div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      disabled={loading}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Shipping Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
                <CardDescription>Enter your shipping address</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your full name"
                    value={shipping.name}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="+216 50 000 000"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="Your address"
                    value={shipping.address}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="City"
                      value={shipping.city}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">Postal Code</Label>
                    <Input
                      id="zip"
                      name="zip"
                      placeholder="Postal Code"
                      value={shipping.zip}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    placeholder="Country"
                    value={shipping.country}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Additional Info</Label>
                  <Textarea
                    id="additionalInfo"
                    placeholder="e.g. Leave package at reception"
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} × {item.quantity}
                      </span>
                      <span>{(item.price * item.quantity).toFixed(2)}€</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-lg">{total.toFixed(3)} Dt</span>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      {success}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-3 pt-4">
                  <Button
                    onClick={handlePlaceOrder}
                    className="w-full"
                    size="lg"
                    disabled={loading || cart.length === 0}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Place Order"
                    )}
                  </Button>

                  <Button
                    onClick={clearCart}
                    variant="outline"
                    className="w-full"
                    disabled={loading}
                  >
                    Clear Cart
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  <span>Cash on Delivery</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
