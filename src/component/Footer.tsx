function Footer() {
    return (
        <>
            <footer className="py-6 border-t text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} WebSocketApp. Tous droits réservés.
            </footer>
        </>
    )
}

export default Footer