"""
Generate Use Case Diagram for Billiard Cafe Management System
Requires: pip install matplotlib pillow
Run: python generate_usecase_image.py
"""

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Ellipse, Rectangle
import numpy as np

def create_usecase_diagram():
    # Create figure
    fig, ax = plt.subplots(1, 1, figsize=(24, 18))
    ax.set_xlim(0, 24)
    ax.set_ylim(0, 18)
    ax.set_aspect('equal')
    ax.axis('off')
    
    # Colors
    COLORS = {
        'title': '#1565C0',
        'member_bg': '#E3F2FD',
        'member_border': '#1976D2',
        'leader_bg': '#E8F5E9', 
        'leader_border': '#388E3C',
        'admin_bg': '#FFF3E0',
        'admin_border': '#E65100',
        'ai_bg': '#FCE4EC',
        'ai_border': '#C2185B',
        'actor_member': '#42A5F5',
        'actor_leader': '#66BB6A',
        'actor_admin': '#FF7043',
        'usecase': '#FFFFFF',
        'usecase_border': '#424242',
    }
    
    # Title
    ax.text(12, 17.5, 'USE CASE DIAGRAM', fontsize=22, fontweight='bold', 
            ha='center', va='center', color=COLORS['title'])
    ax.text(12, 17, 'HE THONG QUAN LY BILLIARD CAFE TICH HOP AI', fontsize=14, 
            ha='center', va='center', color='#666666')
    
    # ==================== GROUP 1: MEMBER/USER ====================
    # Background box
    box1 = FancyBboxPatch((0.3, 8.5), 7.5, 8, boxstyle="round,pad=0.1",
                          facecolor=COLORS['member_bg'], edgecolor=COLORS['member_border'], linewidth=3)
    ax.add_patch(box1)
    ax.text(4.05, 16.2, '1. MEMBER / USER', fontsize=12, fontweight='bold',
            ha='center', va='center', color=COLORS['member_border'])
    
    # Subgroups for Member
    subgroups_member = [
        ('Authentication', (0.5, 14.2), ['Dang ky', 'Dang nhap', 'Doi mat khau', 'Dang xuat']),
        ('Quan ly dat lich', (0.5, 11.8), ['Dat ban', 'Huy dat', 'Xem lich su']),
        ('Goi mon', (0.5, 9.5), ['Xem menu', 'Goi mon an', 'Goi mon uong']),
        ('AI Assistant', (4.0, 14.2), ['Chat voi AI', 'Hoi ban trong', 'Goi y mon']),
    ]
    
    for subgroup_name, (sx, sy), usecases in subgroups_member:
        is_ai = 'AI' in subgroup_name
        box = FancyBboxPatch((sx, sy - len(usecases)*0.5 - 0.3), 3.3, len(usecases)*0.5 + 0.6,
                             boxstyle="round,pad=0.05",
                             facecolor=COLORS['ai_bg'] if is_ai else '#FFFFFF',
                             edgecolor=COLORS['ai_border'] if is_ai else COLORS['member_border'], 
                             linewidth=2)
        ax.add_patch(box)
        ax.text(sx + 1.65, sy + 0.1, subgroup_name, fontsize=9, fontweight='bold',
                ha='center', va='center', color=COLORS['ai_border'] if is_ai else COLORS['member_border'])
        
        for i, uc in enumerate(usecases):
            ellipse = Ellipse((sx + 1.65, sy - (i + 0.7)), 2.8, 0.4, 
                            facecolor=COLORS['usecase'], edgecolor=COLORS['usecase_border'], linewidth=1.5)
            ax.add_patch(ellipse)
            ax.text(sx + 1.65, sy - (i + 0.7), uc, fontsize=8, ha='center', va='center')
    
    # Actor MEMBER
    member_actor = plt.Circle((1.5, 5), 0.6, color=COLORS['actor_member'], ec='#1565C0', linewidth=2)
    ax.add_patch(member_actor)
    ax.plot([1.5, 1.5], [4.4, 3.8], color='#1565C0', linewidth=2)
    ax.plot([1.0, 2.0], [4.1, 4.1], color='#1565C0', linewidth=2)
    ax.plot([1.5, 1.0], [3.8, 3.3], color='#1565C0', linewidth=2)
    ax.plot([1.5, 2.0], [3.8, 3.3], color='#1565C0', linewidth=2)
    ax.text(1.5, 2.7, 'MEMBER', fontsize=10, fontweight='bold', ha='center', va='center', color='#1565C0')
    ax.text(1.5, 2.3, '/USER', fontsize=9, ha='center', va='center', color='#666666')
    
    # ==================== GROUP 2: LEADER / STAFF ====================
    box2 = FancyBboxPatch((8.2, 8.5), 7.5, 8, boxstyle="round,pad=0.1",
                          facecolor=COLORS['leader_bg'], edgecolor=COLORS['leader_border'], linewidth=3)
    ax.add_patch(box2)
    ax.text(11.95, 16.2, '2. LEADER / STAFF', fontsize=12, fontweight='bold',
            ha='center', va='center', color=COLORS['leader_border'])
    
    # Subgroups for Leader
    subgroups_leader = [
        ('Quan ly ban', (8.4, 14.2), ['Tao ban', 'Sua thong tin ban', 'Xoa ban', 'Dat gia thue']),
        ('Quan ly dat lich', (8.4, 11.8), ['Duyet dat lich', 'Tu choi dat', 'Xem ds dat lich']),
        ('Check-in/Out', (8.4, 9.5), ['Check-in', 'Check-out', 'Tinh tien']),
        ('AI Analytics', (11.9, 14.2), ['Xem thong ke', 'Bao cao DT', 'Du doan']),
    ]
    
    for subgroup_name, (sx, sy), usecases in subgroups_leader:
        is_ai = 'AI' in subgroup_name
        box = FancyBboxPatch((sx, sy - len(usecases)*0.5 - 0.3), 3.3, len(usecases)*0.5 + 0.6,
                             boxstyle="round,pad=0.05",
                             facecolor=COLORS['ai_bg'] if is_ai else '#FFFFFF',
                             edgecolor=COLORS['ai_border'] if is_ai else COLORS['leader_border'],
                             linewidth=2)
        ax.add_patch(box)
        ax.text(sx + 1.65, sy + 0.1, subgroup_name, fontsize=9, fontweight='bold',
                ha='center', va='center', color=COLORS['ai_border'] if is_ai else COLORS['leader_border'])
        
        for i, uc in enumerate(usecases):
            ellipse = Ellipse((sx + 1.65, sy - (i + 0.7)), 2.8, 0.4,
                            facecolor=COLORS['usecase'], edgecolor=COLORS['usecase_border'], linewidth=1.5)
            ax.add_patch(ellipse)
            ax.text(sx + 1.65, sy - (i + 0.7), uc, fontsize=8, ha='center', va='center')
    
    # Actor LEADER
    leader_actor = plt.Circle((9.4, 5), 0.6, color=COLORS['actor_leader'], ec='#2E7D32', linewidth=2)
    ax.add_patch(leader_actor)
    ax.plot([9.4, 9.4], [4.4, 3.8], color='#2E7D32', linewidth=2)
    ax.plot([8.9, 9.9], [4.1, 4.1], color='#2E7D32', linewidth=2)
    ax.plot([9.4, 8.9], [3.8, 3.3], color='#2E7D32', linewidth=2)
    ax.plot([9.4, 9.9], [3.8, 3.3], color='#2E7D32', linewidth=2)
    ax.text(9.4, 2.7, 'LEADER', fontsize=10, fontweight='bold', ha='center', va='center', color='#2E7D32')
    ax.text(9.4, 2.3, '/STAFF', fontsize=9, ha='center', va='center', color='#666666')
    
    # ==================== GROUP 3: SYSTEM ADMIN ====================
    box3 = FancyBboxPatch((16.1, 8.5), 7.5, 8, boxstyle="round,pad=0.1",
                           facecolor=COLORS['admin_bg'], edgecolor=COLORS['admin_border'], linewidth=3)
    ax.add_patch(box3)
    ax.text(19.85, 16.2, '3. SYSTEM ADMIN', fontsize=12, fontweight='bold',
            ha='center', va='center', color=COLORS['admin_border'])
    
    # Subgroups for Admin
    subgroups_admin = [
        ('Quan ly NV', (16.3, 14.2), ['Them NV', 'Sua NV', 'Xoa NV', 'Phan ca']),
        ('Quan ly Menu', (16.3, 11.8), ['Them mon', 'Sua mon', 'Xoa mon', 'QL danh muc']),
        ('He thong', (16.3, 9.5), ['Sao luu DL', 'Khoi phuc', 'Cau hinh']),
        ('AI Config', (19.8, 14.2), ['Cau hinh AI', 'Xem logs AI', 'Gioi han su dung']),
    ]
    
    for subgroup_name, (sx, sy), usecases in subgroups_admin:
        is_ai = 'AI' in subgroup_name
        box = FancyBboxPatch((sx, sy - len(usecases)*0.5 - 0.3), 3.3, len(usecases)*0.5 + 0.6,
                             boxstyle="round,pad=0.05",
                             facecolor=COLORS['ai_bg'] if is_ai else '#FFFFFF',
                             edgecolor=COLORS['ai_border'] if is_ai else COLORS['admin_border'],
                             linewidth=2)
        ax.add_patch(box)
        ax.text(sx + 1.65, sy + 0.1, subgroup_name, fontsize=9, fontweight='bold',
                ha='center', va='center', color=COLORS['ai_border'] if is_ai else COLORS['admin_border'])
        
        for i, uc in enumerate(usecases):
            ellipse = Ellipse((sx + 1.65, sy - (i + 0.7)), 2.8, 0.4,
                            facecolor=COLORS['usecase'], edgecolor=COLORS['usecase_border'], linewidth=1.5)
            ax.add_patch(ellipse)
            ax.text(sx + 1.65, sy - (i + 0.7), uc, fontsize=8, ha='center', va='center')
    
    # Actor ADMIN
    admin_actor = plt.Circle((17.3, 5), 0.6, color=COLORS['actor_admin'], ec='#BF360C', linewidth=2)
    ax.add_patch(admin_actor)
    ax.plot([17.3, 17.3], [4.4, 3.8], color='#BF360C', linewidth=2)
    ax.plot([16.8, 17.8], [4.1, 4.1], color='#BF360C', linewidth=2)
    ax.plot([17.3, 16.8], [3.8, 3.3], color='#BF360C', linewidth=2)
    ax.plot([17.3, 17.8], [3.8, 3.3], color='#BF360C', linewidth=2)
    ax.text(17.3, 2.7, 'ADMIN', fontsize=10, fontweight='bold', ha='center', va='center', color='#BF360C')
    ax.text(17.3, 2.3, 'SYSTEM', fontsize=9, ha='center', va='center', color='#666666')
    
    # ==================== CONNECTIONS ====================
    # Member connections (example)
    connections = [
        # Member -> Auth
        ((1.5, 4.4), (2.0, 14.5)),
        # Member -> Dat lich
        ((1.5, 4.4), (2.0, 12.1)),
        # Member -> AI
        ((1.5, 4.4), (5.0, 14.5)),
        # Leader -> Quan ly ban
        ((9.4, 4.4), (9.9, 14.5)),
        # Leader -> AI
        ((9.4, 4.4), (13.3, 14.5)),
        # Admin -> Quan ly NV
        ((17.3, 4.4), (17.8, 14.5)),
        # Admin -> AI
        ((17.3, 4.4), (20.8, 14.5)),
    ]
    
    for start, end in connections:
        ax.annotate('', xy=end, xytext=start,
                   arrowprops=dict(arrowstyle='->', color='#757575', lw=1.5))
    
    # ==================== LEGEND ====================
    legend_y = 1.0
    ax.text(12, legend_y + 0.5, 'LEGEND', fontsize=11, fontweight='bold', ha='center', color='#333333')
    
    # Actor legend
    actors_legend = [
        (7, legend_y, COLORS['actor_member'], 'Member/User'),
        (10, legend_y, COLORS['actor_leader'], 'Leader/Staff'),
        (13, legend_y, COLORS['actor_admin'], 'Admin'),
    ]
    
    for x, y, color, label in actors_legend:
        circle = plt.Circle((x, y + 0.2), 0.25, color=color, ec='#333333', linewidth=1)
        ax.add_patch(circle)
        ax.plot([x, x], [y - 0.05, y - 0.3], color='#333333', linewidth=1.5)
        ax.plot([x - 0.2, x + 0.2], [y - 0.1, y - 0.1], color='#333333', linewidth=1.5)
        ax.plot([x, x - 0.15], [y - 0.3, y - 0.45], color='#333333', linewidth=1.5)
        ax.plot([x, x + 0.15], [y - 0.3, y - 0.45], color='#333333', linewidth=1.5)
        ax.text(x + 0.5, y, label, fontsize=9, va='center')
    
    # AI indicator
    ai_box = FancyBboxPatch((16, legend_y - 0.4), 1.5, 0.7, boxstyle="round,pad=0.02",
                            facecolor=COLORS['ai_bg'], edgecolor=COLORS['ai_border'], linewidth=1.5)
    ax.add_patch(ai_box)
    ax.text(16.75, legend_y, 'AI Features', fontsize=8, ha='center', va='center', color=COLORS['ai_border'])
    
    # Save (without show to avoid blocking)
    plt.tight_layout()
    plt.savefig('use_case_diagram.png', dpi=200, bbox_inches='tight', 
                facecolor='white', edgecolor='none')
    plt.savefig('use_case_diagram.pdf', bbox_inches='tight', facecolor='white')
    print("Da tao xong: use_case_diagram.png va use_case_diagram.pdf")
    plt.close()

if __name__ == "__main__":
    create_usecase_diagram()
