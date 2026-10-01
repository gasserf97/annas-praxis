"use client";

import { useState } from "react";
import { deleteClient } from "@/app/actions/clients";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function DeleteClientButton({ id, name }: { id: string; name: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button type="button" variant="destructive" onClick={() => setOpen(true)}>
        Kunde löschen
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{name} löschen?</DialogTitle>
            <DialogDescription>
              Sitzungen, Termine und die Einwilligung werden mitgelöscht. Das lässt sich nicht rückgängig machen.
            </DialogDescription>
          </DialogHeader>
          <form action={deleteClient}>
            <input type="hidden" name="id" value={id} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Behalten
              </Button>
              <Button type="submit" variant="destructive">
                Endgültig löschen
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
