interface DashboardProps {
    params: {
        idUser: string;
    };
}

function Dashboard({params} : DashboardProps) {

    console.log('voici id user:', params.idUser)
    return (
        <div>Bienvenue sur votre dashboard Paul</div>
    )
}

export default Dashboard