<?php

namespace App\Controller\Admin;

use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Eleve;
use App\Entity\Cours;
use App\Entity\Inscription;

class DashboardController extends AbstractDashboardController
{
    #[Route('/admin', name: 'app_admin')]
	public function index(): Response
	{
		return $this->render('admin/dashboard.html.twig');
	}

    public function configureDashboard(): Dashboard
    {
        return Dashboard::new()
            ->setTitle('Amea Main');
    }

    public function configureMenuItems(): iterable
    {
        yield MenuItem::linkToDashboard('Dashboard', 'fa fa-home');
        yield MenuItem::linkToCrud('Eleve', 'fas fa-user', Eleve::class);
        yield MenuItem::linkToCrud('Cours', 'fas fa-user', Cours::class);
        yield MenuItem::linkToCrud('Inscription', 'fas fa-user', Inscription::class);
    }
}
