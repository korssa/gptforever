// admin-upload-publish.tsx
}
} catch (err) {
alert("Upload error");
}
};


return (
<div>
<Button
onClick={() => setIsOpen(true)}
size={buttonProps?.size || "default"}
className={buttonProps?.className}
>
<Upload className="h-4 w-4 mr-2" /> {buttonText}
</Button>
<Dialog open={isOpen} onOpenChange={setIsOpen}>
<DialogContent>
<DialogHeader>
<DialogTitle>Upload App (Published)</DialogTitle>
<DialogDescription>This app will be published immediately.</DialogDescription>
</DialogHeader>


<div className="space-y-4">
<div>
<label className="block text-sm font-medium mb-1">App Name</label>
<Input
value={formData.name}
onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
placeholder="Enter app name"
/>
</div>
<div>
<label className="block text-sm font-medium mb-1">Developer</label>
<Input
value={formData.developer}
onChange={(e) => setFormData((prev) => ({ ...prev, developer: e.target.value }))}
placeholder="Enter developer name"
/>
</div>
<div>
<label className="block text-sm font-medium mb-1">Description</label>
<Input
value={formData.description}
onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
placeholder="Enter app description"
/>
</div>
<div>
<label className="block text-sm font-medium mb-1">Icon</label>
<label className="flex items-center gap-2 cursor-pointer">
<input type="file" accept="image/*" hidden onChange={(e) => setIconFile(e.target.files?.[0] || null)} />
{iconUrl ? (
<img src={iconUrl} className="w-12 h-12 object-cover rounded" alt="Preview" />
) : (
<span className="text-sm text-gray-500">Click to upload</span>
)}
</label>
</div>
<div>
<label className="block text-sm font-medium mb-1">Tags</label>
<Input
value={formData.tags}
onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
placeholder="Comma-separated"
/>
<p className="text-xs text-gray-400 mt-1">e.g., game, utility</p>
</div>
</div>


<DialogFooter>
<Button variant="outline" onClick={() => setIsOpen(false)}>
Cancel
</Button>
<Button onClick={handleSubmit} disabled={!formData.name || !formData.developer || !iconFile}>
Upload
</Button>
</DialogFooter>
</DialogContent>
</Dialog>
</div>
);
}
