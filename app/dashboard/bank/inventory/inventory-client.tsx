"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Minus, AlertTriangle, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { bulkUpdateInventory } from "@/lib/actions/inventory";
import { toast } from "sonner";

export function InventoryClientTable({ initialData }: { initialData: any[] }) {
  const [inventory, setInventory] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);

  const handleIncrement = (id: string) => {
    setInventory(prev => prev.map(item => item.id === id ? { ...item, units: item.units + 1 } : item));
  };

  const handleDecrement = (id: string) => {
    setInventory(prev => prev.map(item => item.id === id && item.units > 0 ? { ...item, units: item.units - 1 } : item));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await bulkUpdateInventory(inventory.map(i => ({ id: i.id, units: i.units })));
      toast.success("Inventory fully synchronized with cloud.");
    } catch (err) {
      toast.error("Failed to sync inventory.");
    } finally {
      setIsSaving(false);
    }
  };

  // Compare if current state diverges from DB initial payload
  const hasChanges = JSON.stringify(inventory) !== JSON.stringify(initialData);

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Blood Group</TableHead>
            <TableHead>Current Units</TableHead>
            <TableHead>Expiry Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventory.map((row) => {
            const isLow = row.units < 5;
            return (
              <TableRow key={row.id} className={isLow ? "bg-destructive/5" : ""}>
                <TableCell className="font-bold text-lg">{row.bloodType}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={`text-xl font-bold ${isLow ? 'text-destructive' : 'text-foreground'}`}>
                      {row.units}
                    </span>
                    {isLow && <Badge variant="destructive" className="ml-2 animate-pulse"><AlertTriangle className="w-3 h-3 mr-1" /> Low Stock</Badge>}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">Expires in 30+ days</span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button type="button" onClick={() => handleDecrement(row.id)} size="icon" variant="outline" className="border-destructive/20 text-destructive hover:bg-destructive hover:text-white shadow-sm" disabled={row.units === 0}>
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Button type="button" onClick={() => handleIncrement(row.id)} size="icon" variant="outline" className="border-primary/20 text-primary hover:bg-primary hover:text-white shadow-sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      
      <div className="flex justify-end mt-6 border-t pt-4">
        <Button onClick={handleSave} disabled={!hasChanges || isSaving} size="lg" className="gap-2 shadow-md">
          <Save className="w-5 h-5" /> 
          {isSaving ? "Syncing to Cloud..." : "Save Changes to Database"}
        </Button>
      </div>
    </div>
  );
}
